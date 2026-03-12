const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all product compositions with joined data
router.get('/', async (req, res) => {
  const query = `
    SELECT 
      pc.*,
      p.Product_Name,
      p.Batch_Number,
      m.Material_Name,
      m.Emission_Factor
    FROM PRODUCT_COMPOSITION pc
    LEFT JOIN PRODUCTS p ON pc.Product_ID = p.Product_ID
    LEFT JOIN MATERIALS m ON pc.Material_ID = m.Material_ID
  `;
  
  try {
    const [rows] = await db.query(query);
    res.json({ productCompositions: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET product composition by ID
router.get('/:id', async (req, res) => {
  const query = `
    SELECT 
      pc.*,
      p.Product_Name,
      p.Batch_Number,
      m.Material_Name,
      m.Emission_Factor
    FROM PRODUCT_COMPOSITION pc
    LEFT JOIN PRODUCTS p ON pc.Product_ID = p.Product_ID
    LEFT JOIN MATERIALS m ON pc.Material_ID = m.Material_ID
    WHERE pc.Composition_ID = ?
  `;
  
  try {
    const [rows] = await db.query(query, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product composition not found' });
    }
    
    res.json({ productComposition: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new product composition
router.post('/', async (req, res) => {
  const { Product_ID, Material_ID, Quantity_Used } = req.body;
  
  if (!Product_ID || !Material_ID || !Quantity_Used) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO PRODUCT_COMPOSITION (Product_ID, Material_ID, Quantity_Used) VALUES (?, ?, ?)',
      [Product_ID, Material_ID, Quantity_Used]
    );
    
    res.status(201).json({
      productComposition: {
        Composition_ID: result.insertId,
        Product_ID,
        Material_ID,
        Quantity_Used
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product composition
router.put('/:id', async (req, res) => {
  const { Product_ID, Material_ID, Quantity_Used } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE PRODUCT_COMPOSITION SET Product_ID = ?, Material_ID = ?, Quantity_Used = ? WHERE Composition_ID = ?',
      [Product_ID, Material_ID, Quantity_Used, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product composition not found' });
    }
    
    res.json({ message: 'Product composition updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product composition
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM PRODUCT_COMPOSITION WHERE Composition_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product composition not found' });
    }
    
    res.json({ message: 'Product composition deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
