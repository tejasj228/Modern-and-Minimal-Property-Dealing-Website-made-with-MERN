// backend/models/Area.js - Updated with societies
const mongoose = require('mongoose');

// 🆕 NEW: Society Schema (third level)
const societySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  mapImage: {
    type: String,
    trim: true,
    default: null
  },
  amenities: [{
    type: String,
    trim: true
  }],
  // Contact information for society
  contact: {
    phone: String,
    email: String
  },
  // Order field for drag & drop reordering
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const subAreaSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    default: '/assets/map.webp'
  },
  mapImage: {
    type: String,
    trim: true,
    default: null
  },
  // 🆕 ADD: Societies array
  societies: [societySchema],
  order: {
    type: Number,
    default: 0
  }
});

const areaSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  subAreas: [subAreaSchema],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt field
areaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Area', areaSchema);