import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GlobalLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGlobalLeaderboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attempt/leaderboard`);
        setLeaderboard(res.data);
      } catch (err) {
        setError('Failed to load global leaderboard');
        console.error(err);
      }
    };

    fetchGlobalLeaderboard();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Global Leaderboard</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Score</th>
            <th>Total Quizzes</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.user._id}>
              <td>{index + 1}</td>
              <td>{entry.user.name}</td>
              <td>{entry.user.email}</td>
              <td>{entry.totalScore}</td>
              <td>{entry.totalQuizzes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalLeaderboard;
