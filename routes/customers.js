const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

// GET customers with their orders (admin only)
router.get('/', async (req, res) => {
  const query = `
    SELECT
      c.Customer_ID,
      c.Contact_Number,
      c.Address,
      c.Created_At AS customer_created_at,
      u.user_id,
      u.username,
      u.full_name,
      u.email,
      u.created_at AS user_created_at,
      o.Order_ID,
      o.Quantity,
      o.Order_Date,
      p.Product_ID,
      p.Product_Name,
      p.Batch_Number
    FROM CUSTOMERS c
    JOIN USERS u ON u.user_id = c.User_ID
    LEFT JOIN ORDERS o ON o.Customer_ID = c.Customer_ID
    LEFT JOIN PRODUCTS p ON p.Product_ID = o.Product_ID
    ORDER BY c.Customer_ID DESC, o.Order_Date DESC, o.Order_ID DESC
  `;

  try {
    const [rows] = await db.query(query);
    const customersById = new Map();

    rows.forEach((row) => {
      if (!customersById.has(row.Customer_ID)) {
        customersById.set(row.Customer_ID, {
          customerId: row.Customer_ID,
          userId: row.user_id,
          username: row.username,
          fullName: row.full_name,
          email: row.email,
          contactNumber: row.Contact_Number,
          address: row.Address,
          customerCreatedAt: row.customer_created_at,
          userCreatedAt: row.user_created_at,
          orders: []
        });
      }

      if (row.Order_ID) {
        customersById.get(row.Customer_ID).orders.push({
          orderId: row.Order_ID,
          quantity: row.Quantity,
          orderDate: row.Order_Date,
          productId: row.Product_ID,
          productName: row.Product_Name,
          batchNumber: row.Batch_Number
        });
      }
    });

    res.json({ customers: Array.from(customersById.values()) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET customer by ID
router.get('/:id', async (req, res) => {
  const query = `
    SELECT
      c.Customer_ID,
      c.Contact_Number,
      c.Address,
      c.Created_At AS customer_created_at,
      u.user_id,
      u.username,
      u.full_name,
      u.email,
      u.created_at AS user_created_at
    FROM CUSTOMERS c
    JOIN USERS u ON u.user_id = c.User_ID
    WHERE c.Customer_ID = ?
  `;

  try {
    const [rows] = await db.query(query, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const row = rows[0];
    res.json({
      customer: {
        customerId: row.Customer_ID,
        userId: row.user_id,
        username: row.username,
        fullName: row.full_name,
        email: row.email,
        contactNumber: row.Contact_Number,
        address: row.Address,
        customerCreatedAt: row.customer_created_at,
        userCreatedAt: row.user_created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new customer (admin)
router.post('/', async (req, res) => {
  const { username, password, email, fullName, contactNumber, address } = req.body;

  if (!username || !password || !fullName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT user_id FROM USERS WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await db.query(
      'INSERT INTO USERS (username, password, role, email, full_name) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, 'customer', email || null, fullName]
    );

    const [customerResult] = await db.query(
      'INSERT INTO CUSTOMERS (User_ID, Contact_Number, Address) VALUES (?, ?, ?)',
      [userResult.insertId, contactNumber || null, address || null]
    );

    res.status(201).json({
      customer: {
        customerId: customerResult.insertId,
        userId: userResult.insertId,
        username,
        fullName,
        email: email || null,
        contactNumber: contactNumber || null,
        address: address || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update customer (admin)
router.put('/:id', async (req, res) => {
  const { username, password, email, fullName, contactNumber, address } = req.body;

  if (!username || !fullName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [customers] = await db.query(
      'SELECT Customer_ID, User_ID FROM CUSTOMERS WHERE Customer_ID = ?',
      [req.params.id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const userId = customers[0].User_ID;

    if (username) {
      const [conflicts] = await db.query(
        'SELECT user_id FROM USERS WHERE username = ? AND user_id <> ?',
        [username, userId]
      );
      if (conflicts.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'UPDATE USERS SET username = ?, full_name = ?, email = ?, password = ? WHERE user_id = ?',
        [username, fullName, email || null, hashedPassword, userId]
      );
    } else {
      await db.query(
        'UPDATE USERS SET username = ?, full_name = ?, email = ? WHERE user_id = ?',
        [username, fullName, email || null, userId]
      );
    }

    await db.query(
      'UPDATE CUSTOMERS SET Contact_Number = ?, Address = ? WHERE Customer_ID = ?',
      [contactNumber || null, address || null, req.params.id]
    );

    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE customer (admin)
router.delete('/:id', async (req, res) => {
  try {
    const [customers] = await db.query(
      'SELECT Customer_ID, User_ID FROM CUSTOMERS WHERE Customer_ID = ?',
      [req.params.id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const userId = customers[0].User_ID;
    await db.query('DELETE FROM USERS WHERE user_id = ?', [userId]);

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
