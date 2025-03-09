# WriteItUpX

A modern web application for collaborative writing and content management.

## Prerequisites

- Docker and Docker Compose installed on your system
- Google OAuth credentials (Client ID and Client Secret)
- MongoDB database (local or Atlas)

## Environment Variables

Before deploying the application, create the following environment files:

### Client (.env in client directory)
```
VITE_API_URL=http://localhost:8000
```

### Server (.env in server directory)
```
NODE_ENV=production
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost
SERVER_URL=http://localhost:8000
```

## Deployment

1. Clone the repository:
```bash
git clone https://github.com/yourusername/writeitupx.git
cd writeitupx
```

2. Set up environment variables:
- Copy the example environment files and update them with your values
- Ensure all required environment variables are set

3. Build and start the containers:
```bash
docker-compose up --build
```

4. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8000

## Development

To run the application in development mode:

1. Start the server:
```bash
cd server
npm install
npm run dev
```

2. Start the client:
```bash
cd client
npm install
npm run dev
```

## Architecture

The application consists of two main components:

- **Frontend**: React application built with Vite
- **Backend**: Node.js/Express API server

## Features

- Google OAuth authentication
- Modern UI with Material-UI components
- Responsive design
- Secure API endpoints
- Docker containerization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
