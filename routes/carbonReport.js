const express = require('express');
const router = express.Router();
const db = require('../config/database');

const TRANSPORT_FACTORS = {
  Air: 1.3,
  Ship: 0.02,
  Truck: 0.1,
  Rail: 0.03
};

const transportCase = `
  CASE tl.Transport_Mode
    WHEN 'Air' THEN ${TRANSPORT_FACTORS.Air}
    WHEN 'Ship' THEN ${TRANSPORT_FACTORS.Ship}
    WHEN 'Truck' THEN ${TRANSPORT_FACTORS.Truck}
    WHEN 'Rail' THEN ${TRANSPORT_FACTORS.Rail}
    ELSE 0
  END
`;

const transportCarbonByMaterialQuery = `
  SELECT
    tl.Material_ID,
    SUM((tl.Weight_KG / 1000) * s.Distance_KM * ${transportCase}) AS transport_carbon
  FROM TRANSPORT_LOG tl
  JOIN SUPPLIERS s ON s.Supplier_ID = tl.Supplier_ID
  GROUP BY tl.Material_ID
`;

// Summary list of products with total carbon
router.get('/products', async (req, res) => {
  const query = `
    SELECT
      p.Product_ID,
      p.Product_Name,
      p.Batch_Number,
      COALESCE(mat.material_total, 0) AS material_total,
      COALESCE(tr.transport_total, 0) AS transport_total,
      COALESCE(mat.material_total, 0) + COALESCE(tr.transport_total, 0) AS total_carbon
    FROM PRODUCTS p
    LEFT JOIN (
      SELECT
        pc.Product_ID,
        SUM(pc.Quantity_Used * m.Emission_Factor) AS material_total
      FROM PRODUCT_COMPOSITION pc
      JOIN MATERIALS m ON m.Material_ID = pc.Material_ID
      GROUP BY pc.Product_ID
    ) mat ON mat.Product_ID = p.Product_ID
    LEFT JOIN (
      SELECT
        pc.Product_ID,
        SUM(
          CASE
            WHEN totals.total_qty > 0
            THEN (pc.Quantity_Used / totals.total_qty) * COALESCE(t.transport_carbon, 0)
            ELSE 0
          END
        ) AS transport_total
      FROM PRODUCT_COMPOSITION pc
      JOIN (
        SELECT Material_ID, SUM(Quantity_Used) AS total_qty
        FROM PRODUCT_COMPOSITION
        GROUP BY Material_ID
      ) totals ON totals.Material_ID = pc.Material_ID
      LEFT JOIN (
        ${transportCarbonByMaterialQuery}
      ) t ON t.Material_ID = pc.Material_ID
      GROUP BY pc.Product_ID
    ) tr ON tr.Product_ID = p.Product_ID
    ORDER BY total_carbon DESC, p.Product_Name ASC
  `;

  try {
    const [rows] = await db.query(query);
    res.json({
      products: rows,
      transportFactors: TRANSPORT_FACTORS
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detailed step-by-step carbon report for one product
router.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const [products] = await db.query('SELECT * FROM PRODUCTS WHERE Product_ID = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];

    const [materials] = await db.query(
      `
        SELECT
          pc.Material_ID,
          m.Material_Name,
          pc.Quantity_Used,
          m.Emission_Factor,
          (pc.Quantity_Used * m.Emission_Factor) AS material_carbon
        FROM PRODUCT_COMPOSITION pc
        JOIN MATERIALS m ON pc.Material_ID = m.Material_ID
        WHERE pc.Product_ID = ?
      `,
      [productId]
    );

    const [transportLogs] = await db.query(
      `
        SELECT
          tl.Log_ID,
          tl.Material_ID,
          m.Material_Name,
          s.Supplier_Name,
          s.City,
          s.Distance_KM,
          tl.Weight_KG,
          tl.Transport_Mode,
          (tl.Weight_KG / 1000) * s.Distance_KM * ${transportCase} AS transport_carbon
        FROM TRANSPORT_LOG tl
        JOIN SUPPLIERS s ON tl.Supplier_ID = s.Supplier_ID
        JOIN MATERIALS m ON tl.Material_ID = m.Material_ID
        WHERE tl.Material_ID IN (
          SELECT Material_ID
          FROM PRODUCT_COMPOSITION
          WHERE Product_ID = ?
        )
        ORDER BY tl.Log_ID DESC
      `,
      [productId]
    );

    const [allocations] = await db.query(
      `
        SELECT
          pc.Material_ID,
          m.Material_Name,
          pc.Quantity_Used,
          COALESCE(t.transport_carbon, 0) AS transport_carbon,
          COALESCE(totals.total_qty, 0) AS total_qty,
          CASE
            WHEN totals.total_qty > 0
            THEN (pc.Quantity_Used / totals.total_qty) * COALESCE(t.transport_carbon, 0)
            ELSE 0
          END AS transport_allocated
        FROM PRODUCT_COMPOSITION pc
        JOIN MATERIALS m ON m.Material_ID = pc.Material_ID
        LEFT JOIN (
          SELECT Material_ID, SUM(Quantity_Used) AS total_qty
          FROM PRODUCT_COMPOSITION
          GROUP BY Material_ID
        ) totals ON totals.Material_ID = pc.Material_ID
        LEFT JOIN (
          ${transportCarbonByMaterialQuery}
        ) t ON t.Material_ID = pc.Material_ID
        WHERE pc.Product_ID = ?
      `,
      [productId]
    );

    const materialTotal = materials.reduce(
      (sum, row) => sum + Number(row.material_carbon || 0),
      0
    );
    const transportTotal = allocations.reduce(
      (sum, row) => sum + Number(row.transport_allocated || 0),
      0
    );

    res.json({
      product,
      steps: {
        materials,
        transportLogs,
        allocations
      },
      totals: {
        materialTotal,
        transportTotal,
        totalCarbon: materialTotal + transportTotal
      },
      assumptions: {
        allocation: 'Transport emissions are allocated to products by material usage share.',
        transportFactors: TRANSPORT_FACTORS
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
