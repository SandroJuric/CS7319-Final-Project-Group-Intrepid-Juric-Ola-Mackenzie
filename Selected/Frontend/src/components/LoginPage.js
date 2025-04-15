import React from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import the useAuth0 hook
import auth0icon from '../auth0.png'; // Keeping the icon reference

// Removed the old GitHub CLIENT_ID constant

const LoginPage = () => {
  // Get Auth0 functions and state using the hook
  const { loginWithRedirect, isLoading, error } = useAuth0();

  // Handle Auth0 login using the SDK's function
  const handleLogin = async () => {
    try {
      // This function redirects the user to the Auth0 login page
      await loginWithRedirect();
    } catch (err) {
      // Log any errors that might occur during the redirect initiation
      console.error("Failed to initiate Auth0 login:", err);
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <h2>Sign in with Auth0</h2>

        {/* Display Auth0 error message if login fails after redirect */}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

        {/* Use the existing button styling but trigger Auth0 login */}
        <button
          className="github-login-button" // Reusing class name, can be renamed if desired
          onClick={handleLogin}
          disabled={isLoading} // Disable button while Auth0 is processing
        >
          <img src={auth0icon} alt="Auth0 Logo" className="github-icon" /> {/* Reusing class name */}
          {isLoading ? 'Logging In...' : 'Log In with Auth0'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

/*
Alright, in this LoginPage component, I swapped out the old GitHub logic.
First, I imported the `useAuth0` hook. Inside the component, I use this hook
to get access to the `loginWithRedirect` function provided by the Auth0 SDK,
as well as `isLoading` and `error` states.

I replaced the old `handleGitHubLogin` function (which manually built a URL)
with a new `handleLogin` function. This new function simply calls `loginWithRedirect()`.
The SDK takes care of directing the user to Auth0 and handling the callback.

I updated the button's `onClick` to call this new `handleLogin`. I also made the
button display "Logging In..." and become disabled when `isLoading` is true (like during
the redirect process), and it shows an error message if the `error` state from `useAuth0`
has something in it (usually after returning from Auth0 if something went wrong).
I kept the CSS class names (`github-login-button`, `github-icon`) for styling continuity,
even though we're using Auth0 now. I also removed the old comments about GitHub endpoints
since they aren't relevant anymore.
*/