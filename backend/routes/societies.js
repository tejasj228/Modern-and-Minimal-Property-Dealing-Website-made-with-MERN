// backend/routes/societies.js - New route for societies
const express = require('express');
const router = express.Router();
const Area = require('../models/Area');

// 🆕 GET /api/societies/:areaKey/:subAreaId - Get societies for a specific sub-area
router.get('/:areaKey/:subAreaId', async (req, res) => {
  try {
    const { areaKey, subAreaId } = req.params;
    
    console.log(`🏘️ Fetching societies for area: ${areaKey}, sub-area: ${subAreaId}`);
    
    const area = await Area.findOne({ key: areaKey });
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    const subArea = area.subAreas.find(sa => sa.id === parseInt(subAreaId));
    
    if (!subArea) {
      return res.status(404).json({
        success: false,
        message: 'Sub-area not found'
      });
    }
    
    // Sort societies by order
    const societies = (subArea.societies || []).sort((a, b) => a.order - b.order);
    
    res.json({
      success: true,
      data: {
        areaName: area.name,
        subAreaName: subArea.title,
        subAreaDescription: subArea.description,
        societies: societies
      }
    });
  } catch (error) {
    console.error('❌ Error fetching societies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching societies',
      error: error.message
    });
  }
});

// 🆕 PUT /api/societies/:areaKey/:subAreaId/reorder - Reorder societies
router.put('/:areaKey/:subAreaId/reorder', async (req, res) => {
  try {
    const { areaKey, subAreaId } = req.params;
    const { societies } = req.body;
    
    console.log(`🔄 Reordering societies for area: ${areaKey}, sub-area: ${subAreaId}`);
    
    const area = await Area.findOne({ key: areaKey });
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    const subAreaIndex = area.subAreas.findIndex(sa => sa.id === parseInt(subAreaId));
    
    if (subAreaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sub-area not found'
      });
    }
    
    // Update societies with new order
    const updatedSocieties = societies.map((society, index) => ({
      ...society,
      order: index
    }));
    
    area.subAreas[subAreaIndex].societies = updatedSocieties;
    await area.save();
    
    console.log('✅ Societies reordered successfully');
    
    res.json({
      success: true,
      message: 'Societies reordered successfully'
    });
  } catch (error) {
    console.error('❌ Error reordering societies:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering societies',
      error: error.message
    });
  }
});

module.exports = router;