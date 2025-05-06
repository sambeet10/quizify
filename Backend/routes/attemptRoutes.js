const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { attemptQuiz, getLeaderboard, getUserAttempts,getAttemptsByQuiz,getGlobalLeaderboard } = require('../controllers/attemptController');

// Submit quiz attempt
router.post('/:quizId', authMiddleware, attemptQuiz);

// Get leaderboard for a quiz
router.get('/leaderboard/:quizId', getLeaderboard);

// Get all attempts by logged-in user
router.get('/user', authMiddleware, getUserAttempts);

router.get('/quiz/:quizId', authMiddleware, getAttemptsByQuiz);

router.get('/leaderboard', getGlobalLeaderboard);

module.exports = router;