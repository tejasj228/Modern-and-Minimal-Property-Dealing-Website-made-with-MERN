// backend/server.js - Fixed for Vercel deployment
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('./middleware/auth');
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan('combined'));

// 🆕 FIXED CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        // Add your frontend URLs here after deployment
        'https://pawan-buildhome-frontend.vercel.app',
        'https://pawan-buildhome.vercel.app',
        // Allow all Vercel preview domains for testing
        /https:\/\/.*\.vercel\.app$/
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🆕 VERCEL FIX: Only create uploads directory in non-serverless environment
if (process.env.NODE_ENV !== 'production') {
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  // Static files for uploaded images (only in development)
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Database connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
    console.log('📂 Database:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    // Don't exit process in production/serverless
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Connect to database
connectDB();

// 🔓 PUBLIC ROUTES (No authentication required)
// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend is running!', 
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 🔓 PUBLIC: Contact form submission (from frontend)
const Contact = require('./models/Contact');
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, interest, message } = req.body;
    
    console.log('📧 PUBLIC: Contact form submission received:', { name, email, phone });
    
    // Validate required fields
    if (!name || !email || !phone || !message) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and message are required'
      });
    }
    
    // Create new contact
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      interest: interest?.trim() || '',
      message: message.trim(),
      source: 'website'
    });
    
    await contact.save();
    
    console.log('✅ Contact inquiry saved successfully:', {
      id: contact._id,
      name: contact.name,
      email: contact.email
    });
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your inquiry! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// 🆕 NEW: Societies route (PUBLIC READ access)
app.use('/api/societies', require('./routes/societies'));

// 🆕 MIXED ROUTES: READ operations public, WRITE operations protected

// Properties routes - GET public, POST/PUT/DELETE protected
app.use('/api/properties', (req, res, next) => {
  if (req.method === 'GET') {
    console.log('🌐 PUBLIC: Properties GET request');
    next(); // Allow GET requests without authentication
  } else {
    console.log('🔐 ADMIN: Properties non-GET request - checking auth');
    authenticateToken(req, res, (err) => {
      if (err) return next(err);
      requireAdmin(req, res, next);
    });
  }
}, require('./routes/properties'));

// Areas routes - GET public, POST/PUT/DELETE protected
app.use('/api/areas', (req, res, next) => {
  if (req.method === 'GET') {
    console.log('🌐 PUBLIC: Areas GET request');
    next(); // Allow GET requests without authentication
  } else {
    console.log('🔐 ADMIN: Areas non-GET request - checking auth');
    authenticateToken(req, res, (err) => {
      if (err) return next(err);
      requireAdmin(req, res, next);
    });
  }
}, require('./routes/areas'));

// Uploads routes - GET public, POST/DELETE protected
app.use('/api/uploads', (req, res, next) => {
  if (req.method === 'GET') {
    console.log('🌐 PUBLIC: Uploads GET request');
    next(); // Allow GET requests without authentication
  } else {
    console.log('🔐 ADMIN: Uploads non-GET request - checking auth');
    authenticateToken(req, res, (err) => {
      if (err) return next(err);
      requireAdmin(req, res, next);
    });
  }
}, require('./routes/uploads'));

// 🔒 PROTECTED: Contact management routes (admin only)
const contactRoutes = require('./routes/contacts');

// Apply auth middleware to contact management routes (excluding POST)
app.use('/api/contacts', (req, res, next) => {
  // Skip authentication for POST requests (already handled above)
  if (req.method === 'POST') {
    return next('route'); // Skip to next route handler
  }
  
  console.log(`🔐 ADMIN: Contact ${req.method} ${req.path} - Checking authentication`);
  
  // Apply authentication for all other methods
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    requireAdmin(req, res, (err) => {
      if (err) return next(err);
      
      console.log(`✅ ADMIN: Authentication successful for ${req.method} ${req.path}`);
      next();
    });
  });
}, contactRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Pawan Buildhome API Server',
    version: '1.0.0',
    security: 'Mixed Authentication (GET public, POST/PUT/DELETE protected)',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      public: [
        '/api/health',
        '/api/auth/login',
        'GET /api/areas',
        'GET /api/properties', 
        'GET /api/properties/area/:areaKey',
        'GET /api/uploads/slider',
        'GET /api/societies/:areaKey/:subAreaId',
        'POST /api/contacts'
      ],
      protected: [
        'POST/PUT/DELETE /api/properties',
        'POST/PUT/DELETE /api/areas', 
        'POST/DELETE /api/uploads',
        'GET/PUT/DELETE /api/contacts'
      ]
    }
  });
});

// 🆕 Catch-all route for API (must be before general 404)
app.use('/api/*', (req, res) => {
  console.log(`❌ API 404: ${req.method} ${req.originalUrl} not found`);
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/api/health',
      '/api/auth/login',
      'GET /api/areas (public)',
      'GET /api/properties (public)',
      'GET /api/uploads/slider (public)',
      'GET /api/societies/:areaKey/:subAreaId (public)',
      'POST /api/contacts (public)',
      'Other methods require authentication'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 🆕 VERCEL EXPORT: Export the app for serverless functions
module.exports = app;

// 🆕 VERCEL FIX: Only start server in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🔓 Public READ: GET /api/areas, /api/properties, /api/uploads, /api/societies`);
    console.log(`🔐 Protected WRITE: POST/PUT/DELETE operations require admin auth`);
    console.log(`👤 Admin login: http://localhost:${PORT}/api/auth/login`);
  });
}