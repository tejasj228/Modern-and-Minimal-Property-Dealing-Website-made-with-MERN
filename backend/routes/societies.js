// backend/routes/societies.js - Enhanced with image support
const express = require('express');
const router = express.Router();
const Area = require('../models/Area');

// GET /api/societies/:areaKey/:subAreaId - Get societies with enhanced image data
router.get('/:areaKey/:subAreaId', async (req, res) => {
  try {
    const { areaKey, subAreaId } = req.params;
    
    console.log(`🏘️ Fetching enhanced societies for area: ${areaKey}, sub-area: ${subAreaId}`);
    
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
    
    // Sort societies by order and enhance with image metadata
    const societies = (subArea.societies || [])
      .sort((a, b) => a.order - b.order)
      .map(society => ({
        ...society.toObject(),
        imageCount: society.images ? society.images.length : 0,
        hasGallery: society.images && society.images.length > 0,
        primaryImage: society.images && society.images.length > 0 
          ? society.images[society.featuredImageIndex || 0] 
          : society.mapImage
      }));
    
    // Get all images for slider
    const sliderImages = area.getAllSocietyImages(parseInt(subAreaId));
    
    res.json({
      success: true,
      data: {
        areaName: area.name,
        subAreaName: subArea.title,
        subAreaDescription: subArea.description,
        societies: societies,
        sliderImages: sliderImages, // For the image slider
        totalImages: sliderImages.length,
        societiesWithImages: societies.filter(s => s.hasGallery).length
      }
    });
  } catch (error) {
    console.error('❌ Error fetching enhanced societies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching societies',
      error: error.message
    });
  }
});

// GET /api/societies/:areaKey/:subAreaId/images - Get all images for slider
router.get('/:areaKey/:subAreaId/images', async (req, res) => {
  try {
    const { areaKey, subAreaId } = req.params;
    
    console.log(`🖼️ Fetching society images for slider: ${areaKey}/${subAreaId}`);
    
    const area = await Area.findOne({ key: areaKey });
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }
    
    const images = area.getAllSocietyImages(parseInt(subAreaId));
    
    res.json({
      success: true,
      data: {
        images: images,
        totalCount: images.length,
        areaName: area.name,
        subAreaName: area.subAreas.find(sa => sa.id === parseInt(subAreaId))?.title
      }
    });
  } catch (error) {
    console.error('❌ Error fetching society images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching society images',
      error: error.message
    });
  }
});

// GET /api/societies/:areaKey/:subAreaId/:societyId - Get individual society details
router.get('/:areaKey/:subAreaId/:societyId', async (req, res) => {
  try {
    const { areaKey, subAreaId, societyId } = req.params;
    
    console.log(`🏘️ Fetching society details: ${areaKey}/${subAreaId}/${societyId}`);
    
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
    
    const society = subArea.societies.find(s => s.id === parseInt(societyId));
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Enhanced society data
    const enhancedSociety = {
      ...society.toObject(),
      imageCount: society.images ? society.images.length : 0,
      hasGallery: society.images && society.images.length > 0,
      primaryImage: society.images && society.images.length > 0 
        ? society.images[society.featuredImageIndex || 0] 
        : society.mapImage,
      allImages: [
        ...(society.images || []),
        ...(society.mapImage ? [society.mapImage] : [])
      ],
      parentArea: {
        key: area.key,
        name: area.name
      },
      parentSubArea: {
        id: subArea.id,
        name: subArea.title
      }
    };
    
    res.json({
      success: true,
      data: enhancedSociety
    });
  } catch (error) {
    console.error('❌ Error fetching society details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching society details',
      error: error.message
    });
  }
});

// PUT /api/societies/:areaKey/:subAreaId/reorder - Reorder societies
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

// PUT /api/societies/:areaKey/:subAreaId/:societyId/featured-image - Set featured image
router.put('/:areaKey/:subAreaId/:societyId/featured-image', async (req, res) => {
  try {
    const { areaKey, subAreaId, societyId } = req.params;
    const { imageIndex } = req.body;
    
    console.log(`🖼️ Setting featured image for society: ${societyId}, image index: ${imageIndex}`);
    
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
    
    const society = subArea.societies.find(s => s.id === parseInt(societyId));
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }
    
    // Validate image index
    if (imageIndex < 0 || imageIndex >= (society.images?.length || 0)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }
    
    society.featuredImageIndex = imageIndex;
    await area.save();
    
    console.log('✅ Featured image updated successfully');
    
    res.json({
      success: true,
      message: 'Featured image updated successfully'
    });
  } catch (error) {
    console.error('❌ Error setting featured image:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting featured image',
      error: error.message
    });
  }
});

module.exports = router;