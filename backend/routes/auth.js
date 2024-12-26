const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'adesh'; // Replace with a real secret key in production

// Sign Up Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign In Route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token with admin status
    const token = jwt.sign({ userId: user._id, isAdmin: user.admin }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, isAdmin: user.admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Users for Admin
router.get('/admin/users', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find(); // Get all users
    res.json(users); // Send back all users with their location info
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
