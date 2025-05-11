import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const imageUrl = import.meta.env.VITE_BACKEND_URL + quiz.image;

  return (
    <div className="card h-100 quiz-card shadow-sm">
      <div className="quiz-image-wrapper">
        <img 
          src={imageUrl} 
          className="card-img-top quiz-image" 
          alt={quiz.title} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
      </div>
      <div className="card-body d-flex flex-column" style={{ background: 'linear-gradient(to right, #ffeff7, #ffcce6)' }}>        
        <h5 className="card-title">{quiz.title}</h5>
        <p className="card-text text-muted mb-1">{quiz.category}</p>
        <p className="card-text" style={{ flexGrow: 1 }}>
          {quiz.description.length > 100 
            ? quiz.description.substring(0, 100) + '...' 
            : quiz.description}
        </p>
        <Link to={`/quiz/${quiz._id}`} className="btn btn-primary mt-auto view-quiz-btn">
          View Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;