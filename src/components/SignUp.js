import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig'; // Ensure Firestore is imported
import { createUserWithEmailAndPassword , signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore'; // For saving user details
import './SignUp.css'; // Import the CSS file

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create the user with Firebase Auth
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(db, 'userMasterTaskManager', user.uid), {
        firstName,
        lastName,
        email,
        uid: user.uid,
      });

      navigate('/dashboard');
    } catch (error) {
        console.log(" while while creating SingUp",error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignUp} className="form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="input"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login" className="link">Go to Login Page</Link>
      </p>
      <button className="button" onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default SignUp;
