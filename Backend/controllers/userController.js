const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    // Prevent 'me' from being used as an ID
    if (req.params.id === 'me') {
      return res.status(400).json({ 
        message: 'Please use /users/me endpoint for current user' 
      });
    }

    const user = await User.findById(req.params.id, 'name email role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error while fetching user.' });
  }
};

// Set user role
const setUserRole = async (req, res) => {
  const userId = req.user.id;
  const { role } = req.body;

  if (!['quizzer', 'quizmaster'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId, 
      { role }, 
      { new: true, select: 'name email role' }
    );
    res.status(200).json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, getUserById, setUserRole, getCurrentUser };