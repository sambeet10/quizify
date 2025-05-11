import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import googleLogo from '../assets/googlelogo.png'; // Import the Google logo

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userData = await authService.login({ email, password });
      login(userData);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, '_self');
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login to Quizify</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* Google Sign-In */}
        <hr />
        <div className="text-center">
          <button 
            onClick={handleGoogleLogin} 
            className="btn btn-light w-100 d-flex align-items-center justify-content-center"
            style={{
              border: '1px solid #ddd',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: 'lightyellow',
            }}
          >
            <img 
              src={googleLogo} 
              alt="Google logo" 
              style={{
                width: '20px',
                height: '20px',
                marginRight: '10px'
              }}
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;