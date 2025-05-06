import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById } from '../services/quizService';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AttemptQuiz = () => {
  const { id } = useParams(); // quizId
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ score: 0, total: 0 });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = user?.token || localStorage.getItem('token');
        if (!token) {
          setError('Unauthorized. Please log in again.');
          return;
        }

        const data = await getQuizById(id, token);
        setQuiz(data);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz.');
      }
    };

    fetchQuiz();
  }, [id, user]);

  const handleOptionChange = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz || !quiz.questions || quiz.questions.length === 0) return;

    try {
      setSubmitting(true);
      const token = user?.token || localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please log in again.');
        return;
      }

      const selectedAnswers = quiz.questions.map((q, index) => {
        const questionId = q._id || q.id || q.questionId;

        return {
          questionId: questionId,
          selectedOption: answers[index] || '',
        };
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/attempt/${quiz._id}`,
        { selectedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult({
        score: response.data.score,
        total: response.data.total,
      });
      setShowResult(true);
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      alert(error?.response?.data?.message || 'Server error during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!quiz) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{quiz.title}</h2>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, index) => (
          <div key={`question-${index}`} className="mb-4">
            <h5>{index + 1}. {q.question}</h5>
            {q.options.map((option, i) => (
              <div className="form-check" key={`option-${index}-${i}`}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${index}`}
                  id={`question-${index}-option-${i}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleOptionChange(index, option)}
                  required
                />
                <label className="form-check-label" htmlFor={`question-${index}-option-${i}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button
          type="submit"
          className="btn btn-success mt-3"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </form>

      {/* Result Modal */}
      {showResult && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Quiz Result</h5>
              </div>
              <div className="modal-body text-center">
                <p className="fs-5">
                  You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/leaderboard/${quiz._id}`)}
                >
                  View Top Scorers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptQuiz;