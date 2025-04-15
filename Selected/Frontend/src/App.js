import React, { useEffect } from 'react'; // Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'; // Import useAuth0 and withAuthenticationRequired
import { setupApiInterceptors } from './api'; // Import the setup function (assuming api.js is in the same directory or adjust path accordingly)

// Importing component pages
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
//import SignupPage from './components/SignupPage';
import Dashboard from './components/dashboard/DashboardPage';
import ArchivedChats from './components/dashboard/ArchivedChats';
import ChatPage from './components/chat_page/ChatPage';
import ProfilePage from './components/ProfilePage';
//import HistoryPage from './components/HistoryPage';
//import NotFoundPage from './components/NotFoundPage'; //  fallback page for invalid routes

// Create protected versions of components that require authentication
// These will automatically redirect to login if the user is not authenticated
const ProtectedDashboard = withAuthenticationRequired(Dashboard);
const ProtectedArchivedChats = withAuthenticationRequired(ArchivedChats);
const ProtectedChatPage = withAuthenticationRequired(ChatPage);
const ProtectedProfilePage = withAuthenticationRequired(ProfilePage);

function App() {
  // Get loading, error, authentication status, and token function from Auth0 hook
  const { isLoading, error, isAuthenticated, getAccessTokenSilently } = useAuth0(); // Added isAuthenticated and getAccessTokenSilently

  // *** Add this useEffect hook to set up the API interceptor ***
  useEffect(() => {
    // Only set up interceptors if the user is authenticated and the function is available
    // This prevents errors during initial load or if the user isn't logged in
    if (isAuthenticated && typeof getAccessTokenSilently === 'function') {
       console.log("App.js: User is authenticated, setting up API interceptors.");
       // Pass the function to the setup function from api.js
       setupApiInterceptors(getAccessTokenSilently);
    } else {
       console.log("App.js: User not authenticated or getAccessTokenSilently not ready, skipping interceptor setup.");
    }
    // Rerun this effect if isAuthenticated or getAccessTokenSilently changes
  }, [isAuthenticated, getAccessTokenSilently]);

  // Display loading indicator while Auth0 SDK initializes
  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading authentication...</div>;
  }

  // Display error message if Auth0 initialization fails
  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>Authentication Error: {error.message}</div>;
  }

  // Render the router and routes once loading/error states are clear
  return (
    <Router>
      <Routes>
        {/* Public Routes - Accessible without login */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes - Require authentication */}
        {/* Using the protected component wrappers */}
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/history" element={<ProtectedArchivedChats />} /> {/* Assuming /history maps to ArchivedChats */}
        <Route path="/chat" element={<ProtectedChatPage />} />
        <Route path="/profile" element={<ProtectedProfilePage />} />

        {/* Commented out routes from original file */}
        {/*
          <Route path="/signup" element={<SignupPage />} /> ??? // Still public if uncommented unless wrapped
          <Route path="/profile" element={<ProfilePage />} /> // This duplicate is covered above by the protected route
        */}

        {/* Fallback route for unmatched paths
          <Route path="*" element={<NotFoundPage />} /> // Still public if uncommented unless wrapped
        */}
      </Routes>
    </Router>
  );
}

export default App;

// I use the Router component to wrap the application and define the routes for
// “/” (landing page) and “/login” (login page). This makes it easy later to add
// more routes (e.g., /signup, /profile, etc.)

/*
Okay, I've updated this App.js file to protect our routes.
First, I imported the `withAuthenticationRequired` helper from the `@auth0/auth0-react` library.
Then, for each page component that should only be accessible after login (`Dashboard`, `ArchivedChats`, `ChatPage`, `ProfilePage`), I created a new "protected" version by wrapping the original component like this: `const ProtectedDashboard = withAuthenticationRequired(Dashboard);`.
What this wrapper does is check if the user is authenticated before rendering the actual component. If they aren't logged in, it automatically redirects them to the Auth0 login page (`LoginPage.js` in our case won't be hit directly unless the user explicitly navigates there or Auth0 redirects there due to an issue). After they log in successfully, Auth0 will redirect them back, and `withAuthenticationRequired` will then let them access the page they originally wanted.
In the `<Routes>` section, I replaced the original components with these new protected versions for the routes `/dashboard`, `/history`, `/chat`, and `/profile`.
The public routes (`/` for LandingPage and `/login` for LoginPage) remain unchanged, using the original components directly, so anyone can access them. The loading and error checks using `useAuth0` are still in place from the previous step to ensure the SDK is ready before rendering any routes.

*** Added a useEffect hook that gets the getAccessTokenSilently function and isAuthenticated status from useAuth0.
*** When the user is authenticated, it calls setupApiInterceptors (imported from api.js) and passes the getAccessTokenSilently function to it.
*** This ensures that the Axios instance defined in api.js will have its request interceptor correctly configured to add the Authorization header to outgoing requests.
*/