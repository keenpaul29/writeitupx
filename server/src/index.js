// Global polyfills and configurations
global.alert = (msg) => console.log('[Alert]:', msg);
global.confirm = (msg) => console.log('[Confirm]:', msg);
global.prompt = (msg) => console.log('[Prompt]:', msg);
global.isServer = true;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const apiLimiter = require("./middleware/rateLimiter.js");
const setupWebSocket = require("./config/websocket");
const connectDB = require("./config/database");
const aiRouter = require("./routes/ai.js");

// Import routes
const authRoutes = require("./routes/auth");
const letterRoutes = require("./routes/letters");

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB().catch(console.dir);

// Enhanced error logging
const errorLogger = (err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers
  });
  next(err);
};

// Middleware
app.use(morgan("dev"));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", process.env.CLIENT_URL, 'https://accounts.google.com'],
      frameSrc: ["'self'", 'https://accounts.google.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://accounts.google.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Configure CORS before other middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.CLIENT_URL, 'https://accounts.google.com']
      : ['http://localhost', 'http://localhost:8000', 'https://accounts.google.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Cookie']
  })
);

// Wait for MongoDB connection before setting up session
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connection.asPromise();
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    touchAfter: 24 * 3600 // time period in seconds
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    domain: process.env.NODE_ENV === 'production' 
      ? process.env.COOKIE_DOMAIN 
      : 'localhost'
  }
}));

app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
require("./config/passport");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/letters", letterRoutes);
app.use("/api/ai", aiRouter);

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    error: process.env.NODE_ENV === 'production' 
      ? {} 
      : err
  });
});

const PORT = process.env.PORT || 5000;
// Initialize WebSocket server
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://***:***@'));
  console.log('Client URL:', process.env.CLIENT_URL);
  console.log('Server URL:', process.env.SERVER_URL);
  alert("Server is running!!");
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running",
    version: "1.0.0"
  });
});
