const User = require('../models/User')

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role') // exclude password
    res.status(200).json(users)
  } catch (err) {
    console.error('Error fetching users:', err)
    res.status(500).json({ message: 'Server error while fetching users.' })
  }
}

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'name email role')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json(user)
  } catch (err) {
    console.error('Error fetching user:', err)
    res.status(500).json({ message: 'Server error while fetching user.' })
  }
}

module.exports = { getAllUsers, getUserById }