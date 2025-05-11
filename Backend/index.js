const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnect = require('./utils/db');
const path = require('path');
const passport = require('passport'); // 👈 import passport

dotenv.config();

require('./utils/passport'); // 👈 setup passport strategies

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const authRouter = require('./routes/authRouter');

app.use(cors());
app.use(express.json());

// 👇 IMPORTANT: Initialize passport
app.use(passport.initialize());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dbConnect();

app.use('/api/auth', authRoutes);
app.use('/api/auth', authRouter); // Google Auth
app.use('/api/quiz', quizRoutes);
app.use('/api', userRoutes);
app.use('/api/attempt', attemptRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));