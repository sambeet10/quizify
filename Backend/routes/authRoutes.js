const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe } = require('../controllers/authController')
const protect = require('../middlewares/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/user', protect, getMe)

module.exports = router
