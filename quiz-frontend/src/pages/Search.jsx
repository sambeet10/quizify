import React, { useState } from 'react';
import axios from 'axios';
import QuizCard from '../components/QuizCard';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setQuizzes([]);

    try {
      const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/quiz/search/filter`;

      // First: Try search by title
      const titleResponse = await axios.get(baseUrl, {
        params: { search: searchTerm },
      });

      if (titleResponse.data.length > 0) {
        setQuizzes(titleResponse.data);
        return;
      }

      // If nothing found by title, try category
      const categoryResponse = await axios.get(baseUrl, {
        params: { category: searchTerm },
      });

      if (categoryResponse.data.length > 0) {
        setQuizzes(categoryResponse.data);
      } else {
        setError(`No quizzes found for "${searchTerm}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong while searching.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Search Quizzes</h2>
      <form className="d-flex mb-4" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter quiz title or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {quizzes.length > 0 && (
        <div className="row">
          {quizzes.map((quiz) => (
            <div className="col-md-4 mb-4" key={quiz._id}>
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      )}

      {quizzes.length === 0 && searchTerm && !error && (
        <p>No quizzes found for "{searchTerm}"</p>
      )}
    </div>
  );
};

export default Search;