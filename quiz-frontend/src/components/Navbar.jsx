import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/quizify-logo.jpg';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src={logo} alt="Quizify Logo" height="40" className="me-2" />
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/quizzes">All Quizzes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/search">Search</Link>
          </li>

          {user?.role === 'quizzer' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/my-attempts">My Attempts</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
            </>
          )}

          {user?.role === 'quizmaster' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/my-quizzes">My Quizzes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/quiz/create">Create Quiz</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
            </>
          )}
        </ul>

        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          {!user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <span className="navbar-text me-3 text-white">
                  {user.name}
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;