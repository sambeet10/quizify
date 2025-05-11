import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QuizAttempts = () => {
  const { id } = useParams(); // quizId
  const { user, loading: authLoading } = useAuth();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attempt/quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch attempts');
        }

        const data = await res.json();
        setAttempts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchAttempts();
    }
  }, [id, user, authLoading]);

  if (authLoading || loading) return <div className="text-center mt-5">Loading attempts...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Attempts for This Quiz</h2>
      {attempts.length === 0 ? (
        <p>No attempts found for this quiz yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr key={attempt._id}>
                  <td>{index + 1}</td>
                  <td>{attempt.user?.name || 'Unknown'}</td>
                  <td>{attempt.user?.email || 'Unknown'}</td>
                  <td>{attempt.score}</td>
                  <td>
                    {attempt.attemptedAt
                        ? new Date(attempt.attemptedAt).toLocaleString()
                        : 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizAttempts;
