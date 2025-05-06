// src/pages/QuizLeaderboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuizLeaderboard = () => {
  const { quizId } = useParams();
  const [topScorers, setTopScorers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attempt/leaderboard/${quizId}`);
        setTopScorers(res.data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      }
    };
    fetchLeaderboard();
  }, [quizId]);

  return (
    <div className="container mt-5">
      <h2>Top Scorers</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {topScorers.map((attempt, index) => (
            <tr key={attempt._id}>
              <td>{index + 1}</td>
              <td>{attempt.user.name}</td>
              <td>{attempt.score}</td>
              <td>{new Date(attempt.attemptedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizLeaderboard;