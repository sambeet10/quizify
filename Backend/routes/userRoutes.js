const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  setUserRole,
  getCurrentUser,
} = require('../controllers/userController');

const protect = require('../middlewares/authMiddleware');

// Get current user - MUST come first
router.get('/users/me', protect, getCurrentUser);

// Get user by ID
router.get('/users/:id', protect, getUserById);

// Get all users
router.get('/users', getAllUsers);

// Set user role
router.put('/users/set-role', protect, setUserRole);

module.exports = router;