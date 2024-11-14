// src/pages/LoginPage.js
import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Toast from "../components/Toast";
import "./LoginPage.css"; 
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate =useNavigate();

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setToastMessage("Successfully signed up!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setToastMessage("Successfully logged in!");
      }
      navigate("/");
    } catch (error) {
        setToastMessage(error.message);
    }
  };

  const closeToast = () => setToastMessage("");

  return (
    <div className="login-page">
      <div className="auth-container">
        <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>

        <div className="input-container email">
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            />
        </div>
        
        <div className="input-container password">
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            />
        </div>
        
        <button onClick={handleAuth} className="auth-button">
          {isSignUp ? "Sign Up" : "Log In"}
        </button>
        <p className="toggle-link" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </p>
      </div>
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
    </div>
  );
};


export default LoginPage;
