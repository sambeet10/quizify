const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

const attemptQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user._id;
    const { selectedAnswers } = req.body; // [{ questionId, selectedOption }]

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctCount = 0;
    const answerDetails = [];

    quiz.questions.forEach((question) => {
      const userAnswer = selectedAnswers.find(
        (ans) => ans.questionId == question._id.toString()
      );

      if (userAnswer) {
        const isCorrect = userAnswer.selectedOption === question.correctAnswer;
        if (isCorrect) correctCount++;

        answerDetails.push({
          questionId: question._id,
          question: question.question, // ✅ include question text
          selectedOption: userAnswer.selectedOption,
          correctAnswer: question.correctAnswer, // ✅ include correct answer
          isCorrect,
        });
      }
    });

    const attempt = new Attempt({
      user: userId,
      quiz: quizId,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      selectedAnswers: answerDetails,
    });

    await attempt.save();

    res.status(200).json({
      message: 'Quiz attempted successfully!',
      score: correctCount,
      total: quiz.questions.length,
      correctAnswers: correctCount,
      attemptId: attempt._id,
      answerDetails, // ✅ send full info back to frontend
    });
  } catch (error) {
    console.error('Error in quiz attempt:', error);
    res.status(500).json({ message: 'Server error during quiz attempt.' });
  }
};

const getLeaderboard = async (req, res) => {
    try {
      const quizId = req.params.quizId.trim(); // ✨ Fix newline or space issues
  
      const topAttempts = await Attempt.find({ quiz: quizId })
        .sort({ score: -1, attemptedAt: 1 })
        .limit(10)
        .populate('user', 'name email');
  
      res.status(200).json(topAttempts);
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
      res.status(500).json({ message: 'Server error while fetching leaderboard.' });
    }
  };
  
  const getUserAttempts = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const attempts = await Attempt.find({ user: userId })
        .sort({ attemptedAt: -1 }) // Newest first
        .populate('quiz', 'title'); // Only bring quiz title
  
      res.status(200).json(attempts);
    } catch (error) {
      console.error('Error fetching user attempts:', error);
      res.status(500).json({ message: 'Failed to fetch your attempts.' });
    }
  };
  
  const getAttemptsByQuiz = async (req, res) => {
    try {
      const quizId = req.params.quizId.trim(); // ✅ Trim to remove newline or extra spaces
      const userId = req.user.id;
  
      // Check if the logged-in user is the creator of this quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  
      if (quiz.createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized access to this quiz\'s attempts' });
      }
  
      // Fetch all attempts on this quiz
      const attempts = await Attempt.find({ quiz: quizId }).populate('user', 'name email');
  
      res.status(200).json(attempts);
    } catch (error) {
      console.error('Error fetching attempts by quiz:', error);
      res.status(500).json({ message: 'Server error while fetching attempts' });
    }
  };  

  const getGlobalLeaderboard = async (req, res) => {
    try {
      const allAttempts = await Attempt.find()
        .populate('user', 'name email');
  
      // Aggregate total scores per user
      const leaderboardMap = new Map();
  
      allAttempts.forEach((attempt) => {
        const userId = attempt.user._id.toString();
  
        if (!leaderboardMap.has(userId)) {
          leaderboardMap.set(userId, {
            user: attempt.user,
            totalScore: 0,
            totalQuizzes: 0,
          });
        }
  
        const userStats = leaderboardMap.get(userId);
        userStats.totalScore += attempt.score;
        userStats.totalQuizzes += 1;
      });
  
      // Convert Map to array & sort by totalScore
      const globalLeaderboard = Array.from(leaderboardMap.values())
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10); // Top 10
  
      res.status(200).json(globalLeaderboard);
    } catch (error) {
      console.error('Global leaderboard fetch error:', error);
      res.status(500).json({ message: 'Server error while fetching global leaderboard.' });
    }
  };
  
module.exports = {
  attemptQuiz,
  getLeaderboard,
  getUserAttempts,
  getAttemptsByQuiz,
  getGlobalLeaderboard
};