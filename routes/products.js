const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PRODUCTS');
    res.json({ products: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PRODUCTS WHERE Product_ID = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new product
router.post('/', async (req, res) => {
  const { Product_Name, Batch_Number } = req.body;
  
  if (!Product_Name || !Batch_Number) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO PRODUCTS (Product_Name, Batch_Number) VALUES (?, ?)',
      [Product_Name, Batch_Number]
    );
    
    res.status(201).json({
      product: {
        Product_ID: result.insertId,
        Product_Name,
        Batch_Number
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  const { Product_Name, Batch_Number } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE PRODUCTS SET Product_Name = ?, Batch_Number = ? WHERE Product_ID = ?',
      [Product_Name, Batch_Number, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM PRODUCTS WHERE Product_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
