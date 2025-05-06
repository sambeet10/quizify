import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [bestScore, setBestScore] = useState(0);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === 'quizzer') {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attempt/user`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setAttempts(res.data);
          const scores = res.data.map(a => a.score);
          setBestScore(scores.length ? Math.max(...scores) : 0);
        }

        if (user.role === 'quizmaster') {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/my-quizzes`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setQuizzes(res.data);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Profile</h2>
      <div className="card p-4 shadow-sm">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        {user.role === 'quizzer' && (
          <>
            <p><strong>Total Quizzes Attempted:</strong> {attempts.length}</p>
            <p><strong>Best Score:</strong> {bestScore}</p>
          </>
        )}

        {user.role === 'quizmaster' && (
          <>
            <p><strong>Total Quizzes Created:</strong> {quizzes.length}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;