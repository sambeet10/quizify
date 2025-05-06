const express = require('express')
const router = express.Router()

const { getAllUsers, getUserById } = require('../controllers/userController')

// Get all users
router.get('/users', getAllUsers)

// Get user by ID
router.get('/users/:id', getUserById)

module.exports = router