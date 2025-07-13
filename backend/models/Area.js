// backend/models/Area.js - Updated with enhanced society image support
const mongoose = require('mongoose');

// Enhanced Society Schema with gallery images
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
  // NEW: Gallery images for slider
  images: [{
    type: String,
    trim: true
  }],
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
  },
  // NEW: Metadata for images
  imageMetadata: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // NEW: Featured image (will be used as primary display)
  featuredImageIndex: {
    type: Number,
    default: 0
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
  // Societies array with enhanced image support
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

// Helper method to get society by ID
areaSchema.methods.getSocietyById = function(subAreaId, societyId) {
  const subArea = this.subAreas.id(subAreaId);
  if (!subArea) return null;
  return subArea.societies.id(societyId);
};

// Helper method to get all societies with images
areaSchema.methods.getSocietiesWithImages = function(subAreaId) {
  const subArea = this.subAreas.id(subAreaId);
  if (!subArea) return [];
  
  return subArea.societies.filter(society => 
    society.images && society.images.length > 0
  );
};

// Helper method to get all society images for slider
areaSchema.methods.getAllSocietyImages = function(subAreaId) {
  const subArea = this.subAreas.id(subAreaId);
  if (!subArea) return [];
  
  const allImages = [];
  subArea.societies.forEach(society => {
    if (society.images && society.images.length > 0) {
      society.images.forEach((image, index) => {
        allImages.push({
          imageUrl: image,
          societyName: society.name,
          societyId: society.id,
          imageIndex: index,
          isMapImage: false
        });
      });
    } else if (society.mapImage) {
      // Fallback to map image if no gallery images
      allImages.push({
        imageUrl: society.mapImage,
        societyName: society.name,
        societyId: society.id,
        imageIndex: 0,
        isMapImage: true
      });
    }
  });
  
  return allImages;
};

module.exports = mongoose.model('Area', areaSchema);