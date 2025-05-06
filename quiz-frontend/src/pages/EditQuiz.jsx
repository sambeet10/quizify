import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, updateQuizById } from '../services/quizService';
import { useAuth } from '../context/AuthContext';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!user) return; // Wait for user to be available

      try {
        const data = await getQuizById(id, user.token);
        setQuiz({
          title: data.title || '',
          description: data.description || '',
          category: data.category || ''
        });
      } catch (err) {
        console.error('Failed to fetch quiz:', err);
      }
    };

    fetchQuiz();
  }, [id, user]);

  const handleChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to update a quiz.');
      return;
    }

    try {
      await updateQuizById(id, quiz, user.token);
      alert('Quiz updated successfully!');
      navigate(`/quiz/${id}`);
    } catch (err) {
      console.error('Failed to update quiz:', err);
      alert('Failed to update quiz.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            name="title"
            className="form-control"
            value={quiz.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            value={quiz.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input
            name="category"
            className="form-control"
            value={quiz.category}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Quiz</button>
      </form>
    </div>
  );
};

export default EditQuiz;