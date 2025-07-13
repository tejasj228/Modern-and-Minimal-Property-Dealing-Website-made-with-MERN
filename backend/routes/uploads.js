const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const SliderImage = require('../models/SliderImage');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage (no local files)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'pawan-buildhome', // Organize files in folder
        ...options
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// POST /api/uploads/image - Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('📤 Uploading to Cloudinary:', req.file.originalname);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      public_id: `property-${Date.now()}`,
      resource_type: 'image'
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: result.public_id,
        originalName: req.file.originalname,
        imageUrl: result.secure_url, // This is the full Cloudinary URL
        size: req.file.size,
        cloudinaryData: {
          public_id: result.public_id,
          version: result.version,
          format: result.format
        }
      }
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// POST /api/uploads/multiple - Upload multiple images
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    console.log(`📤 Uploading ${req.files.length} files to Cloudinary`);

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map((file, index) =>
      uploadToCloudinary(file.buffer, {
        public_id: `property-${Date.now()}-${index}`,
        resource_type: 'image'
      })
    );

    const results = await Promise.all(uploadPromises);

    const uploadedFiles = results.map((result, index) => ({
      filename: result.public_id,
      originalName: req.files[index].originalname,
      imageUrl: result.secure_url,
      size: req.files[index].size,
      cloudinaryData: {
        public_id: result.public_id,
        version: result.version,
        format: result.format
      }
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('❌ Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// GET /api/uploads/slider - Get all slider images (unchanged)
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
    
    console.log('📤 Uploading slider image to Cloudinary:', req.file.originalname);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      public_id: `slider-${Date.now()}`,
      resource_type: 'image'
    });

    const sliderImage = new SliderImage({
      title: title || req.file.originalname,
      imageUrl: result.secure_url, // Store full Cloudinary URL
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

    // Extract public_id from Cloudinary URL if it's a Cloudinary image
    if (sliderImage.imageUrl.includes('cloudinary.com')) {
      try {
        const urlParts = sliderImage.imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(`pawan-buildhome/${publicId}`);
        console.log('✅ Image deleted from Cloudinary:', publicId);
      } catch (cloudinaryError) {
        console.error('⚠️ Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
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

// GET /api/uploads/files - Get list of uploaded files (for admin panel)
router.get('/files', async (req, res) => {
  try {
    // For Cloudinary, we can't easily list all files without pagination
    // So we'll return an empty array or implement Cloudinary Admin API
    // For now, return empty array since files are stored in properties/slider collections
    
    res.json({
      success: true,
      count: 0,
      data: [],
      message: 'Files are now stored in Cloudinary. Check individual properties and slider images.'
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

// DELETE /api/uploads/:filename - Delete uploaded file (legacy endpoint)
router.delete('/:filename', (req, res) => {
  res.json({
    success: false,
    message: 'File deletion not supported with Cloudinary. Delete through properties or slider management.'
  });
});

module.exports = router;