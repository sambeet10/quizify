const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getAllQuizzesByCreator,
  updateQuiz,
  deleteQuiz,
  searchAndFilterQuizzes
} = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');
const quizMasterOnly = require('../middlewares/quizMasterOnly');
const upload = require('../middlewares/fileUpload');

router.post(
  '/create',
  authMiddleware,
  quizMasterOnly,
  upload.single('image'),
  createQuiz
);

router.get('/', getAllQuizzes);

router.get('/my-quizzes', authMiddleware, quizMasterOnly, getAllQuizzesByCreator);

router.get('/:id', authMiddleware, getQuizById);

router.put('/edit/:quizId', authMiddleware, updateQuiz);

router.delete('/delete/:quizId', authMiddleware, deleteQuiz);

router.get('/search/filter', searchAndFilterQuizzes);

module.exports = router;