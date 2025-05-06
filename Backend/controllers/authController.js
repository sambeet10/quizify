const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'quizmaster' ? 'quizmaster' : 'quizzer' // validate input
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get Logged-In User
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.status(200).json(user)
}