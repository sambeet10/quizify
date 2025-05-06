import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // ✅ use the exported hook

const Profile = () => {
  const { user } = useAuth(); // ✅ get user from context
  const [attempts, setAttempts] = useState([]);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attempt/user`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setAttempts(res.data);
        const scores = res.data.map(a => a.score);
        setBestScore(scores.length ? Math.max(...scores) : 0);
      } catch (err) {
        console.error('Failed to fetch attempts', err);
      }
    };

    if (user) fetchAttempts(); // avoid calling if user is null
  }, [user]);

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Profile</h2>
      <div className="card p-4 shadow-sm">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Total Quizzes Attempted:</strong> {attempts.length}</p>
        <p><strong>Best Score:</strong> {bestScore}</p>
      </div>
    </div>
  );
};

export default Profile;