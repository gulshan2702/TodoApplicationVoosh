import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import './Navigation.css';  // Navigation CSS for styling
import { GithubAuthProvider } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebaseConfig';
const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        auth.signOut();
        await GithubAuthProvider.logout();
       navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Task Manager </Link>
      </div>
      <div className="navbar-links">
        {/* Display Login/Logout based on the authentication state */}
        {currentUser ? (
          <>
            <span className="welcome-message">Welcome, {currentUser.email}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
