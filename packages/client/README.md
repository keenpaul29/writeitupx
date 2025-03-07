# WriteitupX Client

This is the frontend client for the WriteitupX application with Google Drive integration.

## Features

- Google OAuth Authentication
- Simple text editor for letter creation
- Google Drive integration for saving letters
- Real-time draft saving
- AI-powered writing suggestions
- User-friendly interface

## Tech Stack

- React 18
- Material UI 5
- Draft.js for rich text editing
- React Router for navigation
- Axios for API requests
- Socket.io for real-time updates

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000.

## Project Structure

```
client/
├── public/             # Static files
├── src/                # Source code
│   ├── components/     # Reusable components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.js          # Main App component
│   └── index.js        # Entry point
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm start` - Starts the development server
- `npm build` - Builds the app for production
- `npm test` - Runs tests
- `npm eject` - Ejects from Create React App

## Environment Variables

The client uses the proxy setting in package.json to forward API requests to the backend server. By default, it's set to `http://localhost:5000`.

## Connecting to the Backend

The client is configured to connect to the backend API at the URL specified in the proxy setting in package.json. Make sure the backend server is running before starting the client. 
