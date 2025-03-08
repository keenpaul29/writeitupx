# WriteUpX Server

The backend server for WriteUpX - providing API endpoints, authentication, and AI integration.

## Features

- 🔐 Google OAuth 2.0 authentication
- 🤖 AI-powered writing suggestions using Google's Gemini Pro
- 📝 RESTful API endpoints for letter management
- ☁️ Google Drive API integration
- 🔄 Real-time updates via WebSocket
- 🛡️ Rate limiting and security middleware
- 📊 MongoDB database integration

## Tech Stack

- Node.js with Express
- MongoDB with Mongoose
- Passport.js for authentication
- Google Gemini Pro AI
- WebSocket for real-time communication
- JWT for token-based authentication

## Prerequisites

- Node.js >= 18
- MongoDB
- Google Cloud Platform account
- Gemini Pro API access

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```bash
PORT=8000
MONGODB_URI=mongodb://localhost:27017/writeupx
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Starts the development server with nodemon
- `npm start` - Starts the production server
- `npm test` - Runs the test suite

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth authentication

### Letters
- `GET /api/letters` - Get all letters
- `POST /api/letters` - Create new letter
- `PUT /api/letters/:id` - Update letter
- `DELETE /api/letters/:id` - Delete letter

### AI
- `POST /api/ai/suggestions` - Get AI-powered writing suggestions

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| MONGODB_URI | MongoDB connection string | Yes |
| GOOGLE_CLIENT_ID | Google OAuth client ID | Yes |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| GEMINI_API_KEY | Google Gemini Pro API key | Yes |
| CLIENT_URL | Frontend application URL | Yes |

## Project Structure

```
src/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── middleware/    # Custom middleware
├── models/        # MongoDB models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Utility functions
└── index.js       # Application entry point
```

## WebSocket Events

- `connection` - Client connected
- `disconnect` - Client disconnected
- `letter:update` - Letter updated
- `letter:delete` - Letter deleted

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Related

- [WriteUpX Client](../client/README.md)
- [Main Project README](../README.md)
