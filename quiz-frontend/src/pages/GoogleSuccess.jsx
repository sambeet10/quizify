import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const redirectAttempted = useRef(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    
    if (!token || redirectAttempted.current) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);

      // Store token immediately
      localStorage.setItem('token', token);
      
      // Update auth state with all user data
      login({
        token,
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,    // Include name
        email: decoded.email   // Include email
      });

      // Set flag to prevent duplicate redirects
      redirectAttempted.current = true;

      // Immediate redirect based on role
      if (decoded.role === null || decoded.role === undefined) {
        console.log('Redirecting to role selection');
        window.location.href = `${window.location.origin}/choose-role`;
      } else {
        console.log('Redirecting to home');
        window.location.href = `${window.location.origin}/`;
      }

    } catch (err) {
      console.error('Token processing failed:', err);
      localStorage.removeItem('quizifyUser');
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [navigate, login]);

  return <div>Logging you in...</div>;
};

export default GoogleSuccess;