import './utils/global.js';  // Fix the import path issue
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const apiLimiter = require('./middleware/rateLimiter.js');
const setupWebSocket = require('./config/websocket');
const aiRouter = require('./routes/ai.js');

// Import routes (we'll create these next)
const authRoutes = require('./routes/auth');
const letterRoutes = require('./routes/letters');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(morgan('dev'));

// Configure CORS before other middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Configure passport
require('./config/passport');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/letters', letterRoutes);

app.use('/api/ai', aiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
// Initialize WebSocket server
const wss = setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Hello World! Server is running on port ${PORT}`);
  alert("Server is running!!")
});


app.get('/', (_, res) => res.send('Hello World!'))

