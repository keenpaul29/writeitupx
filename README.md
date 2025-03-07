# WriteUpX - AI-Powered Letter Writing Assistant

A full-stack monorepo web application that helps users create professional letters with AI-powered suggestions and Google Drive integration.

## Features

- 🤖 AI-powered writing suggestions using Google's Gemini Pro
- 🔐 Google OAuth Authentication
- 📝 Modern text editor for letter creation
- ☁️ Google Drive integration for saving letters
- 💾 Real-time draft saving
- 🎨 Beautiful, responsive UI
- ✨ Modern landing page with hero section

## Tech Stack

### Frontend
- React with Vite
- Material-UI (MUI)
- React Router
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB for database
- Google OAuth 2.0
- Google Drive API
- Google Gemini Pro AI

### DevOps
- Vercel for deployment
- Monorepo architecture
- Concurrent development servers
- Docker containerization
- GitHub Actions CI/CD
- Automated testing and linting
- MongoDB containerization
- Docker Compose for local development

## Project Structure

```
writeupx/
├── .github/            # GitHub Actions workflows
├── package.json        # Root package.json with workspaces
├── vercel.json        # Vercel deployment config
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose config
├── client/            # React frontend
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── server/            # Node.js backend
│   ├── package.json
│   └── src/
├── .gitignore
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/writeupx.git
   cd writeupx
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create `.env` files in both client and server directories:

   **server/.env**:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

   **client/.env**:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```
   This will start both client and server concurrently.

## Development

### Standard Development
- Run client only: `npm run dev:client`
- Run server only: `npm run dev:server`
- Run tests: `npm test`
- Run linting: `npm run lint`

### Docker Development
1. Start the development environment:
   ```bash
   docker-compose up
   ```

2. Stop the development environment:
   ```bash
   docker-compose down
   ```

3. Rebuild containers after dependency changes:
   ```bash
   docker-compose up --build
   ```

## Deployment

### Vercel Deployment
The project is configured for deployment on Vercel:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set up environment variables in Vercel dashboard:
   - Add all environment variables from server/.env
   - Set VITE_API_URL to your production API URL

### Docker Deployment
1. Build the Docker image:
   ```bash
   docker build -t writeupx .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 \
     -e MONGODB_URI=your_mongodb_uri \
     -e JWT_SECRET=your_jwt_secret \
     -e GOOGLE_CLIENT_ID=your_google_client_id \
     -e GOOGLE_CLIENT_SECRET=your_google_client_secret \
     -e GEMINI_API_KEY=your_gemini_api_key \
     writeupx
   ```

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

1. **Continuous Integration**:
   - Runs on every push and pull request
   - Executes test suite
   - Performs linting checks
   - Ensures build process succeeds

2. **Continuous Deployment**:
   - Automatically deploys to Vercel on main branch
   - Requires successful CI checks
   - Manages environment variables securely

### Required Secrets
Set these secrets in your GitHub repository:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GEMINI_API_KEY`

## API Documentation

### Authentication Endpoints
- POST /api/auth/google - Google OAuth authentication

### Letter Endpoints
- GET /api/letters - Get all letters
- POST /api/letters - Create new letter
- PUT /api/letters/:id - Update letter
- DELETE /api/letters/:id - Delete letter

### AI Endpoints
- POST /api/ai/suggestions - Get AI-powered writing suggestions

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.
