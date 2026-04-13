const express = require('express');
const router = express.Router();
const db = require('../config/database');

const requireMaterialWriteAccess = (req, res, next) => {
  const role = req.session && req.session.role;
  if (role !== 'admin' && role !== 'supplier') {
    return res.status(403).json({ error: 'Only admin or supplier can modify materials' });
  }
  next();
};

// GET all materials
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM MATERIALS');
    res.json({ materials: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET material by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM MATERIALS WHERE Material_ID = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json({ material: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new material
router.post('/', requireMaterialWriteAccess, async (req, res) => {
  const { Material_Name, Emission_Factor } = req.body;
  
  if (!Material_Name || !Emission_Factor) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO MATERIALS (Material_Name, Emission_Factor) VALUES (?, ?)',
      [Material_Name, Emission_Factor]
    );
    
    res.status(201).json({
      material: {
        Material_ID: result.insertId,
        Material_Name,
        Emission_Factor
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update material
router.put('/:id', requireMaterialWriteAccess, async (req, res) => {
  const { Material_Name, Emission_Factor } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE MATERIALS SET Material_Name = ?, Emission_Factor = ? WHERE Material_ID = ?',
      [Material_Name, Emission_Factor, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json({ message: 'Material updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE material
router.delete('/:id', requireMaterialWriteAccess, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM MATERIALS WHERE Material_ID = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
