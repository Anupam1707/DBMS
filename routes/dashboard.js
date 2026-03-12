const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const [suppliers] = await db.query('SELECT COUNT(*) as count FROM SUPPLIERS');
        const [materials] = await db.query('SELECT COUNT(*) as count FROM MATERIALS');
        const [products] = await db.query('SELECT COUNT(*) as count FROM PRODUCTS');
        const [transportLogs] = await db.query('SELECT COUNT(*) as count FROM TRANSPORT_LOG');
        const [productCompositions] = await db.query('SELECT COUNT(*) as count FROM PRODUCT_COMPOSITION');
        
        res.json({
            suppliers: suppliers[0].count,
            materials: materials[0].count,
            products: products[0].count,
            transportLogs: transportLogs[0].count,
            productCompositions: productCompositions[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recent transport logs
router.get('/recent-transports', async (req, res) => {
    const query = `
        SELECT 
            t.Log_ID,
            t.Weight_KG,
            t.Transport_Mode,
            s.Supplier_Name,
            m.Material_Name
        FROM TRANSPORT_LOG t
        LEFT JOIN SUPPLIERS s ON t.Supplier_ID = s.Supplier_ID
        LEFT JOIN MATERIALS m ON t.Material_ID = m.Material_ID
        ORDER BY t.Log_ID DESC
        LIMIT 10
    `;
    
    try {
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get transport mode distribution
router.get('/transport-distribution', async (req, res) => {
    const query = `
        SELECT 
            Transport_Mode,
            COUNT(*) as count,
            SUM(Weight_KG) as total_weight
        FROM TRANSPORT_LOG
        GROUP BY Transport_Mode
    `;
    
    try {
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get top suppliers by shipments
router.get('/top-suppliers', async (req, res) => {
    const query = `
        SELECT 
            s.Supplier_Name,
            s.City,
            COUNT(t.Log_ID) as shipment_count,
            SUM(t.Weight_KG) as total_weight
        FROM SUPPLIERS s
        LEFT JOIN TRANSPORT_LOG t ON s.Supplier_ID = t.Supplier_ID
        GROUP BY s.Supplier_ID
        ORDER BY shipment_count DESC
        LIMIT 5
    `;
    
    try {
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get materials with highest emissions
router.get('/high-emission-materials', async (req, res) => {
    const query = `
        SELECT 
            Material_Name,
            Emission_Factor
        FROM MATERIALS
        ORDER BY Emission_Factor DESC
        LIMIT 5
    `;
    
    try {
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
