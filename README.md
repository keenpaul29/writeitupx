# WriteUpX

<div align="center">
  <h3>AI-Powered Letter Writing Assistant</h3>
  <p>A full-stack monorepo web application that helps users create professional letters with AI-powered suggestions and Google Drive integration.</p>
</div>

## ✨ Features

- 🤖 **AI Integration** - Smart writing suggestions using Google's Gemini Pro
- 🔐 **Secure Authentication** - Google OAuth 2.0 integration
- 📝 **Rich Text Editor** - Modern WYSIWYG editor for letter creation
- ☁️ **Cloud Storage** - Seamless Google Drive integration
- 💾 **Auto-Save** - Real-time draft saving
- 🎨 **Modern UI** - Responsive Material-UI components
- 🔄 **Real-time Updates** - WebSocket integration for live changes
- 🛡️ **Security** - Rate limiting, helmet protection, and JWT authentication

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Material-UI (MUI) 5
- Draft.js Editor
- React Router 6
- Axios & Socket.io

### Backend
- Node.js with Express
- MongoDB & Mongoose
- Google Gemini Pro AI
- Passport.js Authentication
- WebSocket Integration

### DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD
- Vercel Deployment
- MongoDB Atlas

## 📁 Project Structure

```
writeupx/
├── .github/                # GitHub Actions workflows
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
│   └── package.json
├── server/                # Node.js backend
│   ├── src/              # Source code
│   │   ├── config/       # Configurations
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   └── package.json
├── package.json           # Root package.json
├── docker-compose.yml     # Docker Compose config
├── Dockerfile            # Docker configuration
└── vercel.json           # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB
- Google Cloud Platform account
- Docker (optional)

### Standard Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/writeupx.git
   cd writeupx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `server/.env`:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_uri
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLIENT_URL=http://localhost:3000
   ```

   Create `client/.env`:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

### Docker Setup

1. **Build and start containers**
   ```bash
   docker-compose up --build
   ```

2. **Stop containers**
   ```bash
   docker-compose down
   ```

## 📜 Available Scripts

- `npm run dev` - Start both client and server in development
- `npm run dev:client` - Start client only
- `npm run dev:server` - Start server only
- `npm run build` - Build both client and server
- `npm test` - Run tests
- `npm run lint` - Run linting

## 🌐 API Documentation

### Authentication
- `POST /api/auth/google` - Google OAuth authentication

### Letters
- `GET /api/letters` - Get all letters
- `POST /api/letters` - Create letter
- `PUT /api/letters/:id` - Update letter
- `DELETE /api/letters/:id` - Delete letter

### AI
- `POST /api/ai/suggestions` - Get AI writing suggestions

## 🚀 Deployment

### Vercel Deployment
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Required Environment Variables
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GEMINI_API_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Related Documentation

- [Client Documentation](client/README.md)
- [Server Documentation](server/README.md)
