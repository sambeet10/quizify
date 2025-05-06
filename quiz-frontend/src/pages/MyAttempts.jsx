import React, { useEffect, useState } from 'react';
import { getUserAttempts } from '../services/attemptService';
import { useAuth } from '../context/AuthContext';

const MyAttempts = () => {
  const { user, loading } = useAuth(); // get loading from context
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) return; // wait until AuthContext has finished loading

    const fetchAttempts = async () => {
      const token = user?.token || localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your attempts.');
        return;
      }

      try {
        const data = await getUserAttempts(token);
        setAttempts(data);
      } catch (err) {
        console.error('Error loading attempts:', err);
        setError('Could not fetch your quiz attempts.');
      }
    };

    fetchAttempts();
  }, [user, loading]);

  if (loading) return <p className="mt-4">Loading...</p>; // optional: show loading state

  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>My Quiz Attempts</h2>
      {attempts.length === 0 ? (
        <p className="mt-4">You haven't attempted any quizzes yet.</p>
      ) : (
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Quiz Title</th>
              <th>Score</th>
              <th>Attempted On</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt, index) => (
              <tr key={attempt._id}>
                <td>{index + 1}</td>
                <td>{attempt.quiz?.title || 'Unknown Quiz'}</td>
                <td>{attempt.score}</td>
                <td>{new Date(attempt.attemptedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyAttempts;