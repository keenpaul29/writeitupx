// Global polyfills and configurations
global.alert = (msg) => console.log('[Alert]:', msg);
global.confirm = (msg) => console.log('[Confirm]:', msg);
global.prompt = (msg) => console.log('[Prompt]:', msg);
global.isServer = true;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const apiLimiter = require("./middleware/rateLimiter.js");
const setupWebSocket = require("./config/websocket");
const aiRouter = require("./routes/ai.js");

// Import routes (we'll create these next)
const authRoutes = require("./routes/auth");
const letterRoutes = require("./routes/letters");

const app = express();
const server = http.createServer(app);

// Middleware
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
app.use(morgan("dev"));

// Configure CORS before other middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.CLIENT_URL, 'https://accounts.google.com']
      : ['http://localhost:3000', 'http://localhost:8000', 'https://accounts.google.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
  })
);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
require("./config/passport");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/letters", letterRoutes);

app.use("/api/ai", aiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
// Initialize WebSocket server
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Hello World! Server is running on port ${PORT}`);
  alert("Server is running!!");
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running",
    version: "1.0.0"
  });
});
