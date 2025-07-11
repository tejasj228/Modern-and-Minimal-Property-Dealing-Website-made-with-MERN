const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Store admin credentials (in production, these should be in database)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  // Hash the password when server starts
  passwordHash: null
};

// Initialize password hash on module load
const initializeAdminPassword = async () => {
  const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';
  ADMIN_CREDENTIALS.passwordHash = await bcrypt.hash(plainPassword, 12);
  console.log('🔐 Admin authentication initialized');
};

// Initialize on startup
initializeAdminPassword();

// POST /api/auth/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check username
    if (username !== ADMIN_CREDENTIALS.username) {
      console.log(`❌ Failed login attempt with username: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
    if (!isPasswordValid) {
      console.log(`❌ Failed login attempt with correct username but wrong password`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: username,
        role: 'admin',
        loginTime: new Date().toISOString()
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h' // Token expires in 24 hours
      }
    );

    console.log(`✅ Successful admin login: ${username} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          username: username,
          role: 'admin'
        },
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// POST /api/auth/verify - Verify token validity
router.post('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      admin: {
        username: req.admin.username,
        role: req.admin.role,
        loginTime: req.admin.loginTime
      }
    }
  });
});

// POST /api/auth/logout - Logout (mainly for logging purposes)
router.post('/logout', authenticateToken, (req, res) => {
  console.log(`🚪 Admin logout: ${req.admin.username} at ${new Date().toISOString()}`);
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// GET /api/auth/me - Get current admin info
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      admin: {
        username: req.admin.username,
        role: req.admin.role,
        loginTime: req.admin.loginTime
      }
    }
  });
});

module.exports = router;