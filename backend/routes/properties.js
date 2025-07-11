const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET /api/properties - Get all properties (sorted by order)
router.get('/', async (req, res) => {
  try {
    const { area, active } = req.query;
    let filter = {};
    
    if (area) {
      filter.areaKey = area;
    }
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    } else {
      filter.isActive = true;
    }

    // Sort by order field, then by createdAt
    const properties = await Property.find(filter).sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
});

// 🆕 PUT /api/properties/reorder - Update properties order (MOVED TO TOP!)
router.put('/reorder', async (req, res) => {
  try {
    console.log('🔄 PROPERTIES REORDER ROUTE HIT!');
    console.log('📊 Request body:', req.body);
    
    const { propertyIds } = req.body; // Array of property IDs in new order
    
    if (!propertyIds || !Array.isArray(propertyIds)) {
      return res.status(400).json({
        success: false,
        message: 'propertyIds array is required'
      });
    }
    
    console.log('🔄 Reordering properties:', propertyIds);
    
    // Update each property's order field
    const updatePromises = propertyIds.map((propertyId, index) => 
      Property.findByIdAndUpdate(
        propertyId,
        { order: index },
        { new: true }
      )
    );
    
    await Promise.all(updatePromises);
    
    console.log('✅ Properties reordered successfully');
    
    res.json({
      success: true,
      message: 'Properties reordered successfully'
    });
  } catch (error) {
    console.error('❌ Error reordering properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering properties',
      error: error.message
    });
  }
});

// GET /api/properties/area/:areaKey - Get properties by area (MUST be before /:id route)
router.get('/area/:areaKey', async (req, res) => {
  try {
    const { areaKey } = req.params;
    // Sort by order field, then by createdAt
    const properties = await Property.find({ 
      areaKey: areaKey, 
      isActive: true 
    }).sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      area: areaKey,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties by area:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties by area',
      error: error.message
    });
  }
});

// GET /api/properties/:id - Get single property (MUST be after /reorder and /area/:areaKey routes)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
});

// POST /api/properties - Create new property
router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
});

// PUT /api/properties/:id - Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
});

// DELETE /api/properties/:id - Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
});

module.exports = router;