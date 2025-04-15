# CS7319-Final-Project-Group-Intrepid-Juric-Ola-Mackenzie

# MyChat Frontend

This project is the frontend for the MyChat messaging system. It is built with React and Axios, designed to interact with a backend API. This guide will help you get the application running on your remote machine.

## Prerequisites

- **Node.js** (v14.x or later) and npm  
  [Download Node.js](https://nodejs.org)
- **Git** (basic usage assumed)

## Setup and Running the Application

Follow these steps to get the MyChat frontend running on your remote machine:

1. Clone the Repository

Clone the repository to your remote machine using Git:

(should be done already)

2. Navigate to the Frontend Directory
Change into the project's frontend folder:

cd Frontend (from project root)
3. Install Dependencies
Install all required dependencies by running:

npm install (make sure node.js command set up)
This command reads your package.json file and installs React, Axios, react-router-dom, and other necessary packages.

Afterwards, enter this command to install NODE MODULES:

npm install react-scripts

DO NOT COMMIT THIS FOLDER< IT IS IN THE GITIGNORE FILE

4. Run the Application in Development Mode
Start the React development server:

npm start
The application will start on port 3000 by default and can be accessed at:

Locally: http://localhost:3000
Remotely: Use your server's IP address (e.g., http://<your-server-ip>:3000)
Note: Make sure port 3000 is open in your firewall settings if you are accessing the app remotely.

5. Create a Production Build (Optional)
If you need to create an optimized production build, run:

npm run build
This will generate a build/ folder containing the production-ready files.

By following these steps, you'll have the MyChat frontend up and running remotely. This setup makes it easy to test and develop the application before integrating it with the backend.