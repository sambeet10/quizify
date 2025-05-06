const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const dbConnect = require('./utils/db')
const authRoutes = require('./routes/authRoutes')
const quizRoutes = require('./routes/quizRoutes')
const userRoutes = require('./routes/userRoutes')
const attemptRoutes = require('./routes/attemptRoutes')
const path = require('path');

dotenv.config()
app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dbConnect()

app.use('/api/auth', authRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api', userRoutes)
app.use('/api/attempt', attemptRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
