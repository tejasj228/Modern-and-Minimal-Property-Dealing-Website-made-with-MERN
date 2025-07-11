import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Chip,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Slideshow as SlideshowIcon,
  Folder as FolderIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { uploadAPI } from '../services/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function Images() {
  const [tabValue, setTabValue] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    altText: '',
    order: '',
    file: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sliderResponse, filesResponse] = await Promise.all([
        uploadAPI.getSliderImages().catch(() => ({ data: [] })),
        uploadAPI.getFiles().catch(() => ({ data: [] }))
      ]);
      
      setSliderImages(sliderResponse.data || []);
      setAllFiles(filesResponse.data || []);
    } catch (error) {
      console.error('Error loading images:', error);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setFormData({
      title: '',
      altText: '',
      order: sliderImages.length.toString(),
      file: null,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: '',
      altText: '',
      order: '',
      file: null,
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleAddSliderImage = async () => {
    if (!formData.file || !formData.title) {
      setError('Please select a file and enter a title');
      return;
    }

    try {
      setUploading(true);
      await uploadAPI.addSliderImage(formData.file, {
        title: formData.title,
        altText: formData.altText || formData.title,
        order: parseInt(formData.order) || 0,
      });
      
      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error adding slider image:', error);
      setError('Failed to add slider image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSliderImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this slider image?')) {
      try {
        await uploadAPI.deleteSliderImage(id);
        loadData();
      } catch (error) {
        console.error('Error deleting slider image:', error);
        setError('Failed to delete slider image');
      }
    }
  };

  const handleDeleteFile = async (filename) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await uploadAPI.deleteFile(filename);
        loadData();
      } catch (error) {
        console.error('Error deleting file:', error);
        setError('Failed to delete file');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Images...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Images Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage slider images and uploaded files
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label={`Slider Images (${sliderImages.length})`} 
            icon={<SlideshowIcon />}
            iconPosition="start"
          />
          <Tab 
            label={`All Files (${allFiles.length})`} 
            icon={<FolderIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Slider Images Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Homepage Slider Images</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Slider Image
          </Button>
        </Box>

        {sliderImages.length > 0 ? (
          <Grid container spacing={3}>
            {sliderImages.map((image) => (
              <Grid item xs={12} sm={6} md={4} key={image._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000${image.imageUrl}`}
                    alt={image.altText}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {image.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {image.altText}
                    </Typography>
                    <Chip 
                      label={`Order: ${image.order}`} 
                      size="small" 
                      color="primary"
                    />
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteSliderImage(image._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <SlideshowIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Slider Images
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={3}>
              Add images to display on your website's homepage slider
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Add First Slider Image
            </Button>
          </Paper>
        )}
      </TabPanel>

      {/* All Files Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>All Uploaded Files</Typography>

        {allFiles.length > 0 ? (
          <Grid container spacing={2}>
            {allFiles.map((file, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="150"
                    image={`http://localhost:5000${file.imageUrl}`}
                    alt={file.filename}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="body2" gutterBottom noWrap>
                      {file.filename}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatFileSize(file.size)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteFile(file.filename)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <FolderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Files Uploaded
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Files uploaded through property management will appear here
            </Typography>
          </Paper>
        )}
      </TabPanel>

      {/* Add Slider Image Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Slider Image</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon />}
                sx={{ mb: 2 }}
              >
                Choose Image File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.file && (
                <Typography variant="body2" color="textSecondary">
                  Selected: {formData.file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alt Text"
                value={formData.altText}
                onChange={handleInputChange('altText')}
                helperText="Description for accessibility"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Display Order"
                type="number"
                value={formData.order}
                onChange={handleInputChange('order')}
                helperText="Lower numbers display first"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddSliderImage}
            variant="contained"
            disabled={!formData.file || !formData.title || uploading}
          >
            {uploading ? 'Adding...' : 'Add Image'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Add Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default Images;