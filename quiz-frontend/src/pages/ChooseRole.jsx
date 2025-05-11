import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode'; // Make sure this is installed

const ChooseRole = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const selectRole = async (role) => {
    try {
      // 1. Update backend
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/set-role`,
        { role },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // 2. Update frontend state
      const decoded = jwtDecode(user.token);
      const updatedUser = {
        ...user,
        role: role // Use the role from the function parameter
      };
      
      login(updatedUser);
      localStorage.setItem('quizifyUser', JSON.stringify(updatedUser));

      // 3. Redirect to home
      navigate('/');

    } catch (err) {
      console.error('Role update failed:', err.response?.data || err.message);
      alert('Failed to set role. Please try again.');
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Select Your Role</h2>
      <button onClick={() => selectRole('quizzer')} className="btn btn-primary m-3">
        Quizzer
      </button>
      <button onClick={() => selectRole('quizmaster')} className="btn btn-secondary m-3">
        Quiz Master
      </button>
    </div>
  );
};

export default ChooseRole;