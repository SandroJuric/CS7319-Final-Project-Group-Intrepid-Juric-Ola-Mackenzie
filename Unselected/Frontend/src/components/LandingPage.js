import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png'; // Ensure logo.png is in src folder

const LandingPage = () => {
      // This component serves as the entry point for our application.
  // It uses the React Router's useNavigate hook to allow navigation between pages.
  // In future enhancements, we could pass props from a parent component to control aspects
  // of the page (e.g., a welcome message based on user status).
  //
  // The communication with the backend can be added here when necessary,
  // such as fetching dynamic content or user-specific data using Axios.

  const navigate = useNavigate();
  

  // I handle button clicks to navigate to different routes.
  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/signup'); // We later create a Signup component and route.
  };

  return (
    <div className="container">
      <img src={logo} alt="MyChat Logo" className="mychat-logo" />
      <h1 className="welcome-title">Welcome to MyChat</h1>
      <p className="text-muted">Connect with your friends and colleagues</p>
      <div className="button-group">
        <button className="btn-primary" onClick={goToLogin}>
          Log in with Auth0
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

// The LandingPage component displays a welcome message and two buttons: Login and Register.
//  When the user clicks on the Login button, the app navigates to the /login route. etc, create
// a signup component later and route to it.