// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import slide1 from '../assets/bg-1.jpg';
import slide2 from '../assets/bg-2.jpg';
import slide3 from '../assets/bg-3.jpg';
import slide4 from '../assets/bg-4.jpg';

const slides = [slide1, slide2, slide3, slide4];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="position-relative">
      <img
        src={slides[currentSlide]}
        alt={`Slide ${currentSlide + 1}`}
        style={{ width: '100%', height: '90vh', objectFit: 'cover' }}
      />
      <div
        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      >
        <h1 className="hero-title">Quizify</h1>

        <Link
            to="/quizzes"
            className="btn btn-info btn-lg mt-5 px-5 see-quizzes-btn"
            style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}
          >
            See Quizzes
        </Link>

      </div>
    </div>
  );
};

export default Home;