import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [questions, setQuestions] = useState([
    { question: '', options: ['', ''], correctAnswer: '' }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options.splice(optIndex, 1);
      setQuestions(updated);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', ''], correctAnswer: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length < 3) {
      return setError('At least 3 questions are required.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('questions', JSON.stringify(questions));
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert('Quiz created successfully!');
      navigate(`/quiz/${response.data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Quiz</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Basic Details */}
        <div className="mb-3">
          <label className="form-label">Quiz Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quiz Cover Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        {/* Questions */}
        <h5 className="mt-4">Questions</h5>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-3 mb-3 rounded">
            <div className="mb-2">
              <label className="form-label">Question {qIndex + 1}</label>
              <input
                type="text"
                className="form-control"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                required
              />
            </div>

            <label className="form-label">Options</label>
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                  required
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeOption(qIndex, optIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="btn btn-outline-secondary mb-2" onClick={() => addOption(qIndex)}>
              Add Option
            </button>

            <div className="mb-2">
              <label className="form-label">Correct Answer</label>
              <input
                type="text"
                className="form-control"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                required
              />
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-outline-primary mb-4" onClick={addQuestion}>
          + Add Another Question
        </button>

        <br />
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;