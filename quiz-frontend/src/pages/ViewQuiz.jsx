import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, deleteQuizById } from '../services/quizService';
import { useAuth } from '../context/AuthContext';

const ViewQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!user) {
        setError('You are not logged in. Please log in to view quiz.');
        setLoading(false);
        return;
      }

      try {
        const data = await getQuizById(id, user.token);
        setQuiz(data);
      } catch (err) {
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchQuiz();
    }
  }, [id, user, authLoading]);

  const handleStartQuiz = () => {
    navigate(`/quiz/${id}/start`);
  };

  const handleEdit = () => {
    navigate(`/quiz/${id}/edit`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirmed) return;

    try {
      await deleteQuizById(id, user.token);
      alert('Quiz deleted successfully');
      navigate('/my-quizzes');
    } catch (err) {
      alert('Failed to delete quiz');
      console.error(err);
    }
  };

  if (authLoading || loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  const imageUrl = quiz.image
    ? import.meta.env.VITE_BACKEND_URL + quiz.image
    : '/fallback-image.jpg';

  return (
    <div className="container mt-5">
      <div className="row g-4 align-items-start">
        <div className="col-md-6">
          <img
            src={imageUrl}
            alt={quiz.title}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <h2>{quiz.title}</h2>
          <p className="text-muted">Category: {quiz.category}</p>
          <p>{quiz.description}</p>
          <p><strong>Created By:</strong> {quiz.createdBy?.name || 'Unknown'}</p>
          <p><strong>Email:</strong> {quiz.createdBy?.email}</p>
          <p><strong>Number of Questions:</strong> {quiz.questions.length}</p>
          <p><strong>Created At:</strong> {new Date(quiz.createdAt).toLocaleDateString()}</p>

          {user.role === 'quizzer' && (
            <button className="btn btn-primary mt-3" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          )}

            {user.role === 'quizmaster' && user._id === quiz.createdBy._id && (
              <div className="mt-4 d-flex flex-wrap gap-2">
                <button className="btn btn-warning" onClick={handleEdit}>Edit Quiz</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete Quiz</button>
                <button className="btn btn-info" onClick={() => navigate(`/quiz/${id}/attempts`)}>
                  See Attempts
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;