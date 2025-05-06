// src/pages/AllQuizzes.jsx
import React, { useEffect, useState } from 'react';
import { getAllQuizzes } from '../services/quizService';
import QuizCard from '../components/QuizCard';

const AllQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">All Quizzes</h2>
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <div className="row">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div className="col-md-4 mb-4" key={quiz._id}>
                <QuizCard quiz={quiz} />
              </div>
            ))
          ) : (
            <p>No quizzes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllQuizzes;