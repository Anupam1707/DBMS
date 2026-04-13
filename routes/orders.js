const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET orders based on role
router.get('/', async (req, res) => {
  const isAdmin = req.session.role === 'admin';

  const baseQuery = `
    SELECT
      o.Order_ID,
      o.Quantity,
      o.Order_Date,
      p.Product_ID,
      p.Product_Name,
      p.Batch_Number,
      c.Customer_ID,
      u.username AS customer_username,
      u.full_name AS customer_name
    FROM ORDERS o
    JOIN CUSTOMERS c ON c.Customer_ID = o.Customer_ID
    JOIN USERS u ON u.user_id = c.User_ID
    JOIN PRODUCTS p ON p.Product_ID = o.Product_ID
  `;

  const query = isAdmin
    ? `${baseQuery} ORDER BY o.Order_Date DESC, o.Order_ID DESC`
    : `${baseQuery} WHERE c.User_ID = ? ORDER BY o.Order_Date DESC, o.Order_ID DESC`;

  try {
    const params = isAdmin ? [] : [req.session.userId];
    const [rows] = await db.query(query, params);
    res.json({ orders: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
