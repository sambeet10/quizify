const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  selectedAnswers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedOption: String,
      isCorrect: Boolean,
    },
  ],
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Attempt', attemptSchema);