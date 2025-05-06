const Quiz = require('../models/Quiz'); 

const createQuiz = async (req, res) => {
  try {
    const { title, description, questions: questionsStr, category } = req.body; // `questions` is a string initially

    // 1. Parse the JSON string for questions
    let questions;
    try {
      questions = JSON.parse(questionsStr); // Convert to array
    } catch (e) {
      return res.status(400).json({ 
        message: 'Questions must be a valid JSON string array.' 
      });
    }

    // 2. Validate required field
    if (!title || !description || !questions || !Array.isArray(questions) || questions.length < 3) {
      return res.status(400).json({ 
        message: 'Title, description, and at least 3 questions are required.' 
      });
    }

    // 3. Validate each question
    for (const q of questions) {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        !q.correctAnswer ||
        !q.options.includes(q.correctAnswer)
      ) {
        return res.status(400).json({ 
          message: 'Each question must have: question text, 2+ options, and a valid correct answer.' 
        });
      }
    }

    // 4. Create and save the quiz
    const quiz = new Quiz({
      title,
      description,
      category,
      questions,
      createdBy: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null // Handle uploaded file
    });

    await quiz.save();
    await quiz.populate('createdBy', 'name email');

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error while creating quiz.' });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }) // latest first

    res.status(200).json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    res.status(500).json({ message: 'Server error while fetching quizzes.' })
  }
}

const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId).populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // If the user is a quizzer, remove correct answers but keep _id for each question
    if (req.user.role === 'quizzer') {
      const quizWithoutAnswers = {
        ...quiz.toObject(),
        questions: quiz.questions.map(q => ({
          _id: q._id,                 // ✅ Include question ID for answer tracking
          question: q.question,
          options: q.options
        }))
      };
      return res.json(quizWithoutAnswers);
    }

    // For quiz masters/admins, return full quiz including correct answers
    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Server error while fetching quiz.' });
  }
};


const getAllQuizzesByCreator = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).populate('createdBy', 'name email')
    res.status(200).json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes by creator:', error)
    res.status(500).json({ message: 'Server error while fetching quizzes' })
  }
}

const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to edit this quiz" });
    }

    // Update quiz with data from request body
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Server error while updating quiz" });
  }
}

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this quiz" });
    }

    await Quiz.findByIdAndDelete(quizId);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error while deleting quiz" });
  }
};

const searchAndFilterQuizzes = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // case-insensitive title match
    }

    const quizzes = await Quiz.find(filter).populate('createdBy', 'name email');
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error in search/filter:', error);
    res.status(500).json({ message: 'Server error during search or filter' });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getAllQuizzesByCreator,
  updateQuiz,
  deleteQuiz,
  searchAndFilterQuizzes
}