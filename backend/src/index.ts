import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import configurations and utilities
import connectDB from './config/db';
import { globalErrorHandler, notFound } from './middlewares/errorHandler';

// Import routes
import userRoutes from './routes/userRoutes';
import cropRoutes from './routes/cropRoutes';
import reportRoutes from './routes/reportRoutes';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Initialize Socket.IO for real-time features
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Market Yield AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/reports', reportRoutes);

// Socket.IO connection handling for real-time notifications
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room for notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle crop alerts
  socket.on('subscribe-crop-alerts', (cropId) => {
    socket.join(`crop-${cropId}`);
    console.log(`User subscribed to crop ${cropId} alerts`);
  });

  // Handle market updates
  socket.on('subscribe-market-updates', () => {
    socket.join('market-updates');
    console.log('User subscribed to market updates');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to other modules
app.set('io', io);

// 404 handler for undefined routes
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🚀 Market Yield AI Backend Server Started
📍 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
🔗 Health check: http://localhost:${PORT}/health
📊 API Base URL: http://localhost:${PORT}/api
🔌 Socket.IO enabled for real-time features
  `);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;
