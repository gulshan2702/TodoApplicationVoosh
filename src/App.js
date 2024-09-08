import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';  // Ensure this is a default export
import Login from './components/Login';    // Ensure this is a default export
import Dashboard from './components/Dashboard';  // Ensure this is a default export
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation/Navigation';
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  console.log("currentUser is there",currentUser);
  return currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
      <Navigation />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
