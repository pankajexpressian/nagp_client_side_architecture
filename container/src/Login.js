import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./Auth";  // Import login from Auth.js
import DOMPurify from "dompurify";  // Import DOMPurify to sanitize inputs
import Seeder from "./Seeder";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    Seeder.initializeLocalStorage();
    // Check if the user is already authenticated
    const loggedInUserId = localStorage.getItem("LoggedInUserId");
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    // If the user is authenticated, redirect to landing page
    if (loggedInUserId && isAuthenticated === "true") {
      navigate("/landingpage");
    }
  }, [navigate]);

  // Sanitize function to remove < and > from the email input
  const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, ""); // Remove < and > characters
  };

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSignIn = () => {
    // Sanitize the email input before proceeding with the login check
    const sanitizedEmail = sanitizeInput(email);

    // Validate the email format
    if (!validateEmail(sanitizedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setTimeout(() => {
        setErrorMessage("");  // Hide error after 3 seconds
      }, 3000);
      return;
    }

    // Proceed with login if the email is valid
    const error = login(sanitizedEmail, setIsAuthenticated);

    if (error) {
      // Sanitize the error message before displaying it to avoid XSS
      const sanitizedError = DOMPurify.sanitize(error);
      setErrorMessage(sanitizedError);

      setTimeout(() => {
        setErrorMessage("");  // Hide error after 3 seconds
      }, 3000);
    } else {
      console.log("Login successful. Navigating to landing page.");
      navigate("/landingpage");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={handleSignIn}
                className="btn btn-primary w-100"
              >
                Sign In
              </button>

              {errorMessage && (
                <div 
                  className="alert alert-danger mt-3" 
                  role="alert"
                  dangerouslySetInnerHTML={{ __html: errorMessage }} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
