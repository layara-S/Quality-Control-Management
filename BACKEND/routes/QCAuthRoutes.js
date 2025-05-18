const express = require('express');
const QCUser = require('../models/QCUser'); // Updated import to use QCUser
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const qcUser = await QCUser.findOne({ email, password }); // Updated variable name
        if (qcUser) {
            res.json({ message: 'Login successful', user: qcUser }); // Updated response
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;