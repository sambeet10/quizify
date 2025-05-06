import React, { useEffect, useState } from 'react';
import { getQuizzesByUser } from '../services/quizService';  // Named import
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';

const MyQuizzes = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        const data = await getQuizzesByUser(user.token);  // Direct usage
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching your quizzes:', err);
      }
    };

    if (user?.token) {
      fetchMyQuizzes();
    }
  }, [user]);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My Quizzes</h3>
      {quizzes.length === 0 ? (
        <p>You haven't created any quizzes yet.</p>
      ) : (
        <div className="row g-4">
          {quizzes.map((quiz) => (
            <div className="col-md-4" key={quiz._id}>
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;