import axios from 'axios';

// Create the Axios instance
const api = axios.create({
  baseURL: 'https://localhost:7189', // TODO: Change this to the production URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variable to hold the token fetching function once provided by App.js
let getAuthTokenSilently = null;

// Export a function to SETUP the interceptor.
export const setupApiInterceptors = (getTokenFunction) => {
  if (typeof getTokenFunction !== 'function') {
    console.error("Invalid getTokenFunction provided to setupApiInterceptors. Expected a function.");
    return;
  }
  getAuthTokenSilently = getTokenFunction; // Store the function

  // Add a request interceptor to the 'api' instance
  api.interceptors.request.use(
    async (config) => {
      console.log(`API Interceptor: Intercepting request to ${config.url}`); // Keep log

      if (!getAuthTokenSilently) {
        console.warn("API Interceptor: getAuthTokenSilently function not available yet.");
        // No token function available, header will not be added.
      } else {
        // Only attempt to get token if the function is available
        try {
          console.log("API Interceptor: Attempting to get token silently..."); // Keep log

          // Call the stored function to get the token silently
          // No need to specify audience here anymore, as Auth0Provider should handle it
          const token = await getAuthTokenSilently();

          if (token) {
            console.log("API Interceptor: Token RECEIVED successfully. Adding Authorization header."); // Keep log
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            console.warn("API Interceptor: No token received from getAuthTokenSilently (token was null or undefined). Header NOT added."); // Keep log and clarify header status
          }
        } catch (error) {
          console.error("API Interceptor: Error DURING getAccessTokenSilently() call. Header NOT added.", error); // Keep log and clarify header status
        }
      } // End of else block for attempting token retrieval

      // *** Added Log: Check if header was ultimately added ***
      if (!config.headers.Authorization) {
        console.warn(`API Interceptor: Authorization header failed to be added for request to ${config.url}.`);
      }
      // *******************************************************

      console.log("API Interceptor: Final request headers being sent:", config.headers); // Keep log
      return config;
    },
    (error) => {
      console.error("API Interceptor: Error in request setup phase", error); // Keep log
      return Promise.reject(error);
    }
  );

  console.log("API Interceptor configured successfully."); // Keep log
};

// Export the Axios instance as the default export
export default api;

// This file is used to create an Axios instance... (comment remains)
// creates an Axios instance... (comment remains)

/*
Alright, the main change here is cleaning up the `getAccessTokenSilently()` call
inside the interceptor. Since i've now correctly configured the `audience` in the
`Auth0Provider` (in index.js), the SDK should automatically request the right type
of token. So, I've removed the explicit `{ audience: '...' }` part from the
`getAccessTokenSilently()` call within the interceptor itself, making the code a bit cleaner.
All the logging we added previously is still here to help diagnose if issues persist.
*** Added a console.warn log specifically to indicate if the Authorization header was ultimately NOT added before the request is sent. ***
*/