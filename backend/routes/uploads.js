const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const SliderImage = require('../models/SliderImage');

// POST /api/uploads/image - Upload single image
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        imageUrl: imageUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// POST /api/uploads/multiple - Upload multiple images
router.post('/multiple', upload.multiple('images'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      imageUrl: `/uploads/${file.filename}`,
      size: file.size
    }));
    
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// GET /api/uploads/slider - Get all slider images
router.get('/slider', async (req, res) => {
  try {
    const sliderImages = await SliderImage.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: sliderImages.length,
      data: sliderImages
    });
  } catch (error) {
    console.error('Error fetching slider images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching slider images',
      error: error.message
    });
  }
});

// POST /api/uploads/slider - Add image to slider
router.post('/slider', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { title, altText, order } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const sliderImage = new SliderImage({
      title: title || req.file.originalname,
      imageUrl,
      altText: altText || title || req.file.originalname,
      order: order || 0
    });

    await sliderImage.save();
    
    res.status(201).json({
      success: true,
      message: 'Slider image added successfully',
      data: sliderImage
    });
  } catch (error) {
    console.error('Error adding slider image:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding slider image',
      error: error.message
    });
  }
});

// DELETE /api/uploads/slider/:id - Delete slider image
router.delete('/slider/:id', async (req, res) => {
  try {
    const sliderImage = await SliderImage.findById(req.params.id);
    
    if (!sliderImage) {
      return res.status(404).json({
        success: false,
        message: 'Slider image not found'
      });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '..', sliderImage.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await SliderImage.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Slider image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slider image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting slider image',
      error: error.message
    });
  }
});

// DELETE /api/uploads/:filename - Delete uploaded file
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
});

// GET /api/uploads/files - Get list of uploaded files
router.get('/files', (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    const files = fs.readdirSync(uploadsDir)
      .filter(file => {
        const filePath = path.join(uploadsDir, file);
        return fs.statSync(filePath).isFile();
      })
      .map(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          imageUrl: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    console.error('Error getting file list:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting file list',
      error: error.message
    });
  }
});

module.exports = router;