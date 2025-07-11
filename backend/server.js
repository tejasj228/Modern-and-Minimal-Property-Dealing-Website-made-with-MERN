const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('./middleware/auth'); // 🆕 Import auth middleware
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan('combined'));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📂 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// 🆕 PUBLIC ROUTES (No authentication required)
// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend is running!', 
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Public contact form submission (frontend users can submit)
app.post('/api/contacts', require('./routes/contacts'));

// 🆕 PROTECTED ADMIN ROUTES (Authentication required)
// Apply authentication middleware to all admin routes
app.use('/api/properties', authenticateToken, requireAdmin, require('./routes/properties'));
app.use('/api/areas', authenticateToken, requireAdmin, require('./routes/areas'));
app.use('/api/uploads', authenticateToken, requireAdmin, require('./routes/uploads'));

// Protect contact management routes (except POST for public form)
const contactRoutes = require('./routes/contacts');
app.use('/api/contacts', authenticateToken, requireAdmin, contactRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Pawan Buildhome API Server',
    version: '1.0.0',
    security: 'Protected with JWT Authentication',
    endpoints: {
      public: [
        '/api/health',
        '/api/auth/login',
        'POST /api/contacts'
      ],
      protected: [
        '/api/properties',
        '/api/areas', 
        '/api/uploads',
        'GET /api/contacts (and other methods)'
      ]
    }
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableEndpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/properties (protected)',
      '/api/areas (protected)',
      '/api/uploads (protected)',
      '/api/contacts'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Security: JWT Authentication enabled`);
  console.log(`👤 Admin login: http://localhost:${PORT}/api/auth/login`);
});