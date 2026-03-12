const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM SUPPLIERS');
    res.json({ suppliers: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM SUPPLIERS WHERE Supplier_ID = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json({ supplier: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new supplier
router.post('/', async (req, res) => {
  const { Supplier_Name, City, Distance_KM } = req.body;
  
  if (!Supplier_Name || !City || !Distance_KM) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO SUPPLIERS (Supplier_Name, City, Distance_KM) VALUES (?, ?, ?)',
      [Supplier_Name, City, Distance_KM]
    );
    
    res.status(201).json({
      supplier: {
        Supplier_ID: result.insertId,
        Supplier_Name,
        City,
        Distance_KM
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update supplier
router.put('/:id', async (req, res) => {
  const { Supplier_Name, City, Distance_KM } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE SUPPLIERS SET Supplier_Name = ?, City = ?, Distance_KM = ? WHERE Supplier_ID = ?',
      [Supplier_Name, City, Distance_KM, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json({ message: 'Supplier updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM SUPPLIERS WHERE Supplier_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
