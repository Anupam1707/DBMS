const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');

// Register new user
router.post('/register', async (req, res) => {
    const { username, password, email, fullName } = req.body;
    
    try {
        // Check if user already exists
        const [users] = await db.query('SELECT * FROM USERS WHERE username = ?', [username]);
        
        if (users.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const [result] = await db.query(
            'INSERT INTO USERS (username, password, email, full_name) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, fullName]
        );
        
        res.json({ 
            message: 'User registered successfully',
            userId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [users] = await db.query('SELECT * FROM USERS WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Set session
        req.session.userId = user.user_id;
        req.session.username = user.username;
        req.session.fullName = user.full_name;
        req.session.email = user.email;
        
        res.json({ 
            message: 'Login successful',
            user: {
                userId: user.user_id,
                username: user.username,
                fullName: user.full_name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Update profile
router.put('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { fullName, email } = req.body;
    
    try {
        await db.query(
            'UPDATE USERS SET full_name = ?, email = ? WHERE user_id = ?',
            [fullName, email, req.session.userId]
        );
        
        // Update session
        req.session.fullName = fullName;
        req.session.email = email;
        
        res.json({ 
            message: 'Profile updated successfully',
            user: {
                userId: req.session.userId,
                username: req.session.username,
                fullName: fullName,
                email: email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change password
router.put('/password', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;
    
    try {
        // Get current user
        const [users] = await db.query('SELECT * FROM USERS WHERE user_id = ?', [req.session.userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = users[0];
        
        // Verify current password
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await db.query(
            'UPDATE USERS SET password = ? WHERE user_id = ?',
            [hashedPassword, req.session.userId]
        );
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check session
router.get('/check', (req, res) => {
    if (req.session.userId) {
        res.json({ 
            authenticated: true,
            user: {
                userId: req.session.userId,
                username: req.session.username,
                fullName: req.session.fullName,
                email: req.session.email
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;
