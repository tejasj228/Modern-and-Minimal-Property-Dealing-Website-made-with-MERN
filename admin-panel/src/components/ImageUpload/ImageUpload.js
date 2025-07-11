import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Card,
  CardMedia,
  Grid,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { uploadAPI } from '../../services/api';

function ImageUpload({ 
  images = [], 
  onImagesChange, 
  maxImages = 5,
  label = "Property Images" 
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(file => 
        uploadAPI.uploadImage(file, (progress) => {
          setUploadProgress(progress);
        })
      );

      const responses = await Promise.all(uploadPromises);
      const newImageUrls = responses.map(response => response.data.imageUrl);
      
      // Add new images to existing ones
      const updatedImages = [...images, ...newImageUrls];
      onImagesChange(updatedImages);
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(updatedImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Upload Button */}
      <Box mb={2}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          onClick={handleButtonClick}
          startIcon={<UploadIcon />}
          disabled={uploading || images.length >= maxImages}
          fullWidth
          sx={{ mb: 1 }}
        >
          {uploading ? 'Uploading...' : `Upload Images (${images.length}/${maxImages})`}
        </Button>
        
        {uploading && (
          <Box>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" color="textSecondary">
              Uploading... {uploadProgress}%
            </Typography>
          </Box>
        )}
      </Box>

      {/* Image Preview Grid */}
      {images.length > 0 ? (
        <Grid container spacing={2}>
          {images.map((imageUrl, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="120"
                  image={`http://localhost:5000${imageUrl}`}
                  alt={`Property image ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: '#fafafa',
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="textSecondary" gutterBottom>
            No images uploaded yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Click "Upload Images" to add property photos
          </Typography>
        </Box>
      )}

      {/* File format info */}
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        Supported formats: JPG, PNG, GIF, WebP. Max {maxImages} images.
      </Typography>
    </Box>
  );
}

export default ImageUpload;