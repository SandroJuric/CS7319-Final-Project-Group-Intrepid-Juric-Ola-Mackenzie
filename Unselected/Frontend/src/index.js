import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react'; // Import Auth0Provider
import App from './App';
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// --- Define your API audience ---
// Make sure this EXACTLY matches the Identifier in Auth0 API settings AND your backend config
const apiAudience = "https://localhost:7189/"; // Added trailing slash based on backend snippet

root.render(
  <React.StrictMode> {/* Recommended */}
    <Auth0Provider
        domain="dev-haynesboone.us.auth0.com" // Your Auth0 domain
        clientId="SzssqVvXMWIqWQ7YxfyMLii5yOinf658" // Your Auth0 client ID
        authorizationParams={{
          // Redirect to the dashboard route after login
          redirect_uri: `${window.location.origin}/dashboard`,
          // *** Add the audience for your backend API ***
          audience: "https://localhost:7189/"
        }}
      >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

/*
Okay, the big change here is adding the `audience` parameter inside `authorizationParams`
within the Auth0Provider. I set its value to "https://localhost:7189/", including the
trailing slash, because that's what the backend code snippet showed it expects.
This tells the Auth0 SDK, "When you get tokens for me, make sure they are valid for
this specific backend API." This is crucial for getting the right kind of Access Token.
I also wrapped the provider in StrictMode, which is generally good practice in React.
*/