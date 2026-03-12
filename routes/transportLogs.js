const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all transport logs with joined data
router.get('/', async (req, res) => {
  const query = `
    SELECT 
      tl.*,
      s.Supplier_Name,
      s.City,
      m.Material_Name
    FROM TRANSPORT_LOG tl
    LEFT JOIN SUPPLIERS s ON tl.Supplier_ID = s.Supplier_ID
    LEFT JOIN MATERIALS m ON tl.Material_ID = m.Material_ID
  `;
  
  try {
    const [rows] = await db.query(query);
    res.json({ transportLogs: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET transport log by ID
router.get('/:id', async (req, res) => {
  const query = `
    SELECT 
      tl.*,
      s.Supplier_Name,
      s.City,
      m.Material_Name
    FROM TRANSPORT_LOG tl
    LEFT JOIN SUPPLIERS s ON tl.Supplier_ID = s.Supplier_ID
    LEFT JOIN MATERIALS m ON tl.Material_ID = m.Material_ID
    WHERE tl.Log_ID = ?
  `;
  
  try {
    const [rows] = await db.query(query, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transport log not found' });
    }
    
    res.json({ transportLog: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new transport log
router.post('/', async (req, res) => {
  const { Material_ID, Supplier_ID, Weight_KG, Transport_Mode } = req.body;
  
  if (!Material_ID || !Supplier_ID || !Weight_KG || !Transport_Mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const validModes = ['Air', 'Ship', 'Truck', 'Rail'];
  if (!validModes.includes(Transport_Mode)) {
    return res.status(400).json({ error: 'Invalid transport mode. Must be Air, Ship, Truck, or Rail' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO TRANSPORT_LOG (Material_ID, Supplier_ID, Weight_KG, Transport_Mode) VALUES (?, ?, ?, ?)',
      [Material_ID, Supplier_ID, Weight_KG, Transport_Mode]
    );
    
    res.status(201).json({
      transportLog: {
        Log_ID: result.insertId,
        Material_ID,
        Supplier_ID,
        Weight_KG,
        Transport_Mode
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update transport log
router.put('/:id', async (req, res) => {
  const { Material_ID, Supplier_ID, Weight_KG, Transport_Mode } = req.body;
  
  const validModes = ['Air', 'Ship', 'Truck', 'Rail'];
  if (!validModes.includes(Transport_Mode)) {
    return res.status(400).json({ error: 'Invalid transport mode. Must be Air, Ship, Truck, or Rail' });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE TRANSPORT_LOG SET Material_ID = ?, Supplier_ID = ?, Weight_KG = ?, Transport_Mode = ? WHERE Log_ID = ?',
      [Material_ID, Supplier_ID, Weight_KG, Transport_Mode, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transport log not found' });
    }
    
    res.json({ message: 'Transport log updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE transport log
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM TRANSPORT_LOG WHERE Log_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transport log not found' });
    }
    
    res.json({ message: 'Transport log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
