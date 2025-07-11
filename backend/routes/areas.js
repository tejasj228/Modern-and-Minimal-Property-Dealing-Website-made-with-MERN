const express = require('express');
const router = express.Router();
const Area = require('../models/Area');

// GET /api/areas - Get all areas (sorted by order)
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    let filter = {};
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    } else {
      filter.isActive = true; // Default to active areas only
    }

    // Sort by order field, then by createdAt
    const areas = await Area.find(filter).sort({ order: 1, createdAt: 1 });
    
    // Convert to the format your frontend expects
    const areasObject = {};
    areas.forEach(area => {
      areasObject[area.key] = {
        name: area.name,
        description: area.description,
        subAreas: area.subAreas.sort((a, b) => a.order - b.order), // Sort sub-areas by order too
        order: area.order
      };
    });
    
    res.json({
      success: true,
      count: areas.length,
      data: areasObject
    });
  } catch (error) {
    console.error('Error fetching areas:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching areas',
      error: error.message
    });
  }
});

// 🆕 PUT /api/areas/reorder - Update areas order (MOVED TO TOP!)
router.put('/reorder', async (req, res) => {
  try {
    console.log('🔄 AREAS REORDER ROUTE HIT!');
    console.log('📊 Request body:', req.body);
    
    const { areaKeys } = req.body; // Array of area keys in new order
    
    if (!areaKeys || !Array.isArray(areaKeys)) {
      return res.status(400).json({
        success: false,
        message: 'areaKeys array is required'
      });
    }
    
    console.log('🔄 Reordering areas:', areaKeys);
    
    // Update each area's order field
    const updatePromises = areaKeys.map((areaKey, index) => 
      Area.findOneAndUpdate(
        { key: areaKey },
        { order: index },
        { new: true }
      )
    );
    
    await Promise.all(updatePromises);
    
    console.log('✅ Areas reordered successfully');
    
    res.json({
      success: true,
      message: 'Areas reordered successfully'
    });
  } catch (error) {
    console.error('❌ Error reordering areas:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering areas',
      error: error.message
    });
  }
});

// 🆕 PUT /api/areas/:key/subareas/reorder - Update sub-areas order
router.put('/:key/subareas/reorder', async (req, res) => {
  try {
    const { key } = req.params;
    const { subAreas } = req.body; // Array of sub-areas with updated order
    
    console.log('🔄 Reordering sub-areas for:', key);
    
    const area = await Area.findOne({ key });
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    // Update sub-areas with new order
    const updatedSubAreas = subAreas.map((subArea, index) => ({
      ...subArea,
      order: index
    }));
    
    area.subAreas = updatedSubAreas;
    await area.save();
    
    console.log('✅ Sub-areas reordered successfully');
    
    res.json({
      success: true,
      message: 'Sub-areas reordered successfully',
      data: area
    });
  } catch (error) {
    console.error('❌ Error reordering sub-areas:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering sub-areas',
      error: error.message
    });
  }
});

// GET /api/areas/:key - Get single area by key (MUST be after /reorder routes)
router.get('/:key', async (req, res) => {
  try {
    const area = await Area.findOne({ key: req.params.key });
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        name: area.name,
        description: area.description,
        subAreas: area.subAreas.sort((a, b) => a.order - b.order),
        order: area.order
      }
    });
  } catch (error) {
    console.error('Error fetching area:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching area',
      error: error.message
    });
  }
});

// POST /api/areas - Create new area
router.post('/', async (req, res) => {
  try {
    const area = new Area(req.body);
    await area.save();
    
    res.status(201).json({
      success: true,
      message: 'Area created successfully',
      data: area
    });
  } catch (error) {
    console.error('Error creating area:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating area',
      error: error.message
    });
  }
});

// PUT /api/areas/:key - Update area
router.put('/:key', async (req, res) => {
  try {
    const area = await Area.findOneAndUpdate(
      { key: req.params.key },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Area updated successfully',
      data: area
    });
  } catch (error) {
    console.error('Error updating area:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating area',
      error: error.message
    });
  }
});

// DELETE /api/areas/:key - Delete area
router.delete('/:key', async (req, res) => {
  try {
    const area = await Area.findOneAndDelete({ key: req.params.key });
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Area deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting area:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting area',
      error: error.message
    });
  }
});

module.exports = router;