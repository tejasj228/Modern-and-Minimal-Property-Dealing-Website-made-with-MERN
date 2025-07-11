import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Fab,
  CardMedia,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  DragIndicator as DragIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';

// Modern drag & drop imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { areaAPI, propertyAPI, uploadAPI } from '../services/api';

// Map Upload Component
const MapUpload = ({ mapImage, onMapChange, label = "Sub-Area Map" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📁 Selected file:', file.name, file.type, file.size);

    try {
      setUploading(true);
      setError(null);
      
      console.log('⬆️ Uploading map image...');
      const response = await uploadAPI.uploadImage(file);
      console.log('✅ Upload response:', response);
      
      onMapChange(response.data.imageUrl);
    } catch (error) {
      console.error('❌ Error uploading map:', error);
      setError(`Failed to upload map image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMap = () => {
    console.log('🗑️ Removing map image');
    onMapChange(null);
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

      {mapImage ? (
        <Box>
          <Card sx={{ mb: 2, maxWidth: 300 }}>
            <CardMedia
              component="img"
              height="200"
              image={`http://localhost:5000${mapImage}`}
              alt="Sub-area map"
              sx={{ objectFit: 'cover' }}
              onError={(e) => {
                console.error('❌ Failed to load map image:', mapImage);
                e.target.src = '/assets/map.webp'; // Fallback
              }}
            />
            <CardContent>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleRemoveMap}
                startIcon={<DeleteIcon />}
              >
                Remove Map
              </Button>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: '#fafafa',
            mb: 2,
          }}
        >
          <MapIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="textSecondary" gutterBottom>
            No map uploaded yet
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Map'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>
        </Box>
      )}

      <Typography variant="caption" color="textSecondary">
        Upload a map image for this sub-area (JPG, PNG, GIF, WebP)
      </Typography>
    </Box>
  );
};

// Sortable Sub-Area Component
const SortableSubArea = ({ subArea, areaKey, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `subarea-${areaKey}-${subArea.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      divider
      sx={{
        border: isDragging ? '2px dashed #B8860B' : 'none',
        borderRadius: isDragging ? 2 : 0,
        backgroundColor: isDragging ? '#f5f5f5' : 'transparent',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: 'flex',
          alignItems: 'center',
          mr: 2,
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
      >
        <DragIcon color="action" />
      </Box>
      <LocationIcon sx={{ mr: 2, color: 'text.secondary' }} />
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1}>
            {subArea.title}
            {subArea.mapImage && (
              <Chip 
                icon={<MapIcon />} 
                label="Has Map" 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            )}
          </Box>
        }
        secondary={subArea.description}
      />
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          onClick={() => {
            console.log('✏️ Editing sub-area:', subArea);
            onEdit(areaKey, subArea);
          }}
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            console.log('🗑️ Deleting sub-area:', subArea.id);
            onDelete(areaKey, subArea.id);
          }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// Sortable Area Component
const SortableAreaCard = ({ areaKey, area, propertyCounts, onEdit, onDelete, onEditSubArea, onDeleteSubArea, onAddSubArea, onSubAreaReorder }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `area-${areaKey}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  // Set up sensors for sub-area drag and drop
  const subAreaSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Accordion
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        border: isDragging ? '2px dashed #B8860B' : '1px solid #e0e0e0',
        boxShadow: isDragging ? '0 8px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: isDragging ? '#e3f2fd' : '#f8f9fa',
          '&:hover': {
            backgroundColor: '#e9ecef',
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Box display="flex" alignItems="center" flex={1}>
            <Box
              {...attributes}
              {...listeners}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 2,
                cursor: isDragging ? 'grabbing' : 'grab',
                '&:active': {
                  cursor: 'grabbing',
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <DragIcon sx={{ color: 'primary.main' }} />
            </Box>
            <MapIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">{area.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {area.subAreas?.length || 0} sub-areas • {propertyCounts[areaKey] || 0} properties
              </Typography>
            </Box>
          </Box>
          <Box onClick={(e) => e.stopPropagation()}>
            <Chip
              label={`${propertyCounts[areaKey] || 0} properties`}
              color={propertyCounts[areaKey] > 0 ? 'primary' : 'default'}
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('✏️ Editing area:', area);
                onEdit(area);
              }}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('🗑️ Deleting area:', areaKey);
                onDelete(areaKey);
              }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box width="100%">
          <Typography variant="body1" paragraph>
            {area.description}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Sub-Areas</Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                console.log('➕ Adding sub-area to:', areaKey);
                onAddSubArea(areaKey);
              }}
            >
              Add Sub-Area
            </Button>
          </Box>

          {area.subAreas && area.subAreas.length > 0 ? (
            <DndContext
              sensors={subAreaSensors}
              collisionDetection={closestCenter}
              onDragEnd={(result) => onSubAreaReorder(areaKey, result)}
            >
              <SortableContext
                items={area.subAreas.map(sa => `subarea-${areaKey}-${sa.id}`)}
                strategy={verticalListSortingStrategy}
              >
                <List>
                  {area.subAreas.map((subArea) => (
                    <SortableSubArea
                      key={subArea.id}
                      subArea={subArea}
                      areaKey={areaKey}
                      onEdit={onEditSubArea}
                      onDelete={onDeleteSubArea}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
              <BusinessIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                No sub-areas yet. Add some sub-areas to organize this area better.
              </Typography>
            </Paper>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

function Areas() {
  const [areas, setAreas] = useState({});
  const [propertyCounts, setPropertyCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false); // 🆕 Added saving state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('area'); // 'area' or 'subarea'
  const [editingArea, setEditingArea] = useState(null);
  const [editingSubArea, setEditingSubArea] = useState(null);
  const [parentAreaKey, setParentAreaKey] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    title: '',
    mapImage: null,
  });

  // Set up sensors for area drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    console.log('🔄 Areas component mounted, loading data...');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading areas and properties...');
      
      // Load areas and property counts in parallel
      const [areasResponse, propertiesResponse] = await Promise.all([
        areaAPI.getAll().catch(err => {
          console.error('❌ Error loading areas:', err);
          return { data: {} };
        }),
        propertyAPI.getAll().catch(err => {
          console.error('❌ Error loading properties:', err);
          return { data: [] };
        })
      ]);

      console.log('📊 Areas response:', areasResponse);
      console.log('📊 Properties response:', propertiesResponse);

      setAreas(areasResponse.data || {});

      // Count properties by area
      const counts = {};
      if (propertiesResponse.data) {
        propertiesResponse.data.forEach(property => {
          counts[property.areaKey] = (counts[property.areaKey] || 0) + 1;
        });
      }
      console.log('📊 Property counts:', counts);
      setPropertyCounts(counts);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setError(`Failed to load areas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Handle area drag and drop reordering - UPDATED WITH PERSISTENCE
  const handleAreaDragEnd = async (result) => {
    const { active, over } = result;

    if (over && active.id !== over.id) {
      setSavingOrder(true); // Show saving indicator
      
      const areaKeys = Object.keys(areas);
      const activeAreaKey = active.id.replace('area-', '');
      const overAreaKey = over.id.replace('area-', '');
      
      const oldIndex = areaKeys.indexOf(activeAreaKey);
      const newIndex = areaKeys.indexOf(overAreaKey);

      const reorderedKeys = arrayMove(areaKeys, oldIndex, newIndex);
      
      // Update local state immediately for responsive UI
      const reorderedAreas = {};
      reorderedKeys.forEach(key => {
        reorderedAreas[key] = areas[key];
      });
      setAreas(reorderedAreas);

      console.log('🔄 Reordered areas locally:', reorderedKeys);
      
      try {
        // 🆕 Persist order to backend
        await areaAPI.reorder(reorderedKeys);
        console.log('✅ Areas order saved to backend');
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('❌ Error saving areas order:', error);
        setError('Failed to save areas order');
        // Reload data to revert changes on error
        loadData();
      } finally {
        setSavingOrder(false);
      }
    }

    setActiveId(null);
  };

  // 🆕 Handle sub-area drag and drop reordering - UPDATED WITH PERSISTENCE
  const handleSubAreaReorder = async (areaKey, result) => {
    const { active, over } = result;

    if (over && active.id !== over.id) {
      setSavingOrder(true); // Show saving indicator
      
      const area = areas[areaKey];
      
      // Extract the actual sub-area IDs
      const activeSubAreaId = parseInt(active.id.replace(`subarea-${areaKey}-`, ''));
      const overSubAreaId = parseInt(over.id.replace(`subarea-${areaKey}-`, ''));
      
      const oldIndex = area.subAreas.findIndex(sa => sa.id === activeSubAreaId);
      const newIndex = area.subAreas.findIndex(sa => sa.id === overSubAreaId);

      const reorderedSubAreas = arrayMove(area.subAreas, oldIndex, newIndex);

      // Update local state immediately for responsive UI
      setAreas(prev => ({
        ...prev,
        [areaKey]: {
          ...area,
          subAreas: reorderedSubAreas
        }
      }));

      console.log('🔄 Reordered sub-areas locally for', areaKey);

      try {
        // 🆕 Persist sub-area order to backend
        await areaAPI.reorderSubAreas(areaKey, reorderedSubAreas);
        console.log('✅ Sub-area order saved to backend');
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('❌ Error updating sub-area order:', error);
        setError('Failed to update sub-area order');
        // Reload data to revert changes on error
        loadData();
      } finally {
        setSavingOrder(false);
      }
    }
  };

  const handleOpenAreaDialog = (area = null) => {
    console.log('🔧 Opening area dialog:', area);
    setDialogType('area');
    setEditingArea(area);
    setEditingSubArea(null);
    setParentAreaKey(null);
    
    if (area) {
      // Find the area data from the areas object
      const areaKey = Object.keys(areas).find(key => areas[key].name === area.name);
      console.log('🔧 Found area key:', areaKey);
      setFormData({
        key: areaKey || '',
        name: area.name || '',
        description: area.description || '',
        title: '',
        mapImage: null,
      });
    } else {
      setFormData({
        key: '',
        name: '',
        description: '',
        title: '',
        mapImage: null,
      });
    }
    setOpenDialog(true);
  };

  const handleOpenSubAreaDialog = (areaKey, subArea = null) => {
    console.log('🔧 Opening sub-area dialog:', areaKey, subArea);
    setDialogType('subarea');
    setEditingArea(null);
    setEditingSubArea(subArea);
    setParentAreaKey(areaKey);
    
    if (subArea) {
      setFormData({
        key: '',
        name: '',
        description: subArea.description || '',
        title: subArea.title || '',
        mapImage: subArea.mapImage || null,
      });
    } else {
      setFormData({
        key: '',
        name: '',
        description: '',
        title: '',
        mapImage: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    console.log('❌ Closing dialog');
    setOpenDialog(false);
    setEditingArea(null);
    setEditingSubArea(null);
    setParentAreaKey(null);
    setFormData({
      key: '',
      name: '',
      description: '',
      title: '',
      mapImage: null,
    });
  };

  const handleInputChange = (field) => (event) => {
    console.log('✏️ Input change:', field, event.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleMapChange = (mapImageUrl) => {
    console.log('🗺️ Map change:', mapImageUrl);
    setFormData(prev => ({
      ...prev,
      mapImage: mapImageUrl
    }));
  };

  const handleSaveArea = async () => {
    try {
      console.log('💾 Saving area:', formData);
      const areaData = {
        key: formData.key.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        description: formData.description,
        subAreas: editingArea ? areas[Object.keys(areas).find(key => areas[key].name === editingArea.name)]?.subAreas || [] : [],
      };

      console.log('💾 Area data to save:', areaData);

      if (editingArea) {
        const areaKey = Object.keys(areas).find(key => areas[key].name === editingArea.name);
        console.log('💾 Updating area:', areaKey);
        const response = await areaAPI.update(areaKey, areaData);
        console.log('✅ Update response:', response);
      } else {
        console.log('💾 Creating new area');
        const response = await areaAPI.create(areaData);
        console.log('✅ Create response:', response);
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('❌ Error saving area:', error);
      setError(`Failed to save area: ${error.message}`);
    }
  };

  const handleSaveSubArea = async () => {
    try {
      console.log('💾 Saving sub-area:', formData, 'to area:', parentAreaKey);
      const area = areas[parentAreaKey];
      const subAreaData = {
        id: editingSubArea ? editingSubArea.id : Date.now(),
        title: formData.title,
        description: formData.description,
        mapImage: formData.mapImage,
      };

      console.log('💾 Sub-area data:', subAreaData);

      let updatedSubAreas;
      if (editingSubArea) {
        updatedSubAreas = area.subAreas.map(sa => 
          sa.id === editingSubArea.id ? subAreaData : sa
        );
      } else {
        updatedSubAreas = [...(area.subAreas || []), subAreaData];
      }

      const updatedAreaData = {
        key: parentAreaKey,
        name: area.name,
        description: area.description,
        subAreas: updatedSubAreas,
      };

      console.log('💾 Updated area data:', updatedAreaData);

      const response = await areaAPI.update(parentAreaKey, updatedAreaData);
      console.log('✅ Sub-area save response:', response);

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('❌ Error saving sub-area:', error);
      setError(`Failed to save sub-area: ${error.message}`);
    }
  };

  const handleDeleteArea = async (areaKey) => {
    const propertyCount = propertyCounts[areaKey] || 0;
    if (propertyCount > 0) {
      setError(`Cannot delete area with ${propertyCount} properties. Remove properties first.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this area?')) {
      try {
        console.log('🗑️ Deleting area:', areaKey);
        await areaAPI.delete(areaKey);
        loadData();
      } catch (error) {
        console.error('❌ Error deleting area:', error);
        setError(`Failed to delete area: ${error.message}`);
      }
    }
  };

  const handleDeleteSubArea = async (areaKey, subAreaId) => {
    if (window.confirm('Are you sure you want to delete this sub-area?')) {
      try {
        console.log('🗑️ Deleting sub-area:', subAreaId, 'from area:', areaKey);
        const area = areas[areaKey];
        const updatedSubAreas = area.subAreas.filter(sa => sa.id !== subAreaId);
        const updatedAreaData = {
          key: areaKey,
          name: area.name,
          description: area.description,
          subAreas: updatedSubAreas,
        };

        console.log('💾 Updated area after sub-area deletion:', updatedAreaData);
        await areaAPI.update(areaKey, updatedAreaData);
        loadData();
      } catch (error) {
        console.error('❌ Error deleting sub-area:', error);
        setError(`Failed to delete sub-area: ${error.message}`);
      }
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Areas...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Areas Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your service areas and sub-areas • Drag to reorder
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenAreaDialog()}
          size="large"
        >
          Add Area
        </Button>
      </Box>

      {/* 🆕 Saving Order Feedback */}
      {savingOrder && (
        <Alert severity="info" sx={{ mb: 2 }}>
          💾 Saving new order...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Areas List with Drag & Drop */}
      {Object.keys(areas).length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleAreaDragEnd}
        >
          <SortableContext
            items={Object.keys(areas).map(key => `area-${key}`)}
            strategy={verticalListSortingStrategy}
          >
            <Box>
              {Object.entries(areas).map(([areaKey, area]) => (
                <SortableAreaCard
                  key={areaKey}
                  areaKey={areaKey}
                  area={area}
                  propertyCounts={propertyCounts}
                  onEdit={handleOpenAreaDialog}
                  onDelete={handleDeleteArea}
                  onEditSubArea={handleOpenSubAreaDialog}
                  onDeleteSubArea={handleDeleteSubArea}
                  onAddSubArea={handleOpenSubAreaDialog}
                  onSubAreaReorder={handleSubAreaReorder}
                />
              ))}
            </Box>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <Box
                sx={{
                  backgroundColor: 'rgba(184, 134, 11, 0.1)',
                  border: '2px dashed #B8860B',
                  borderRadius: 2,
                  p: 2,
                  minHeight: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" color="primary">
                  {activeId.includes('area-') ? 'Moving Area...' : 'Moving Sub-Area...'}
                </Typography>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MapIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Areas Found
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Start by adding your first service area
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenAreaDialog()}
          >
            Add Your First Area
          </Button>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'area' 
            ? (editingArea ? 'Edit Area' : 'Add New Area')
            : (editingSubArea ? 'Edit Sub-Area' : 'Add New Sub-Area')
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType === 'area' ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Area Key"
                    value={formData.key}
                    onChange={handleInputChange('key')}
                    placeholder="e.g., central-noida"
                    helperText="Unique identifier (lowercase, no spaces)"
                    required
                    disabled={!!editingArea}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Area Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="e.g., Central Noida"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    placeholder="Describe this area and its characteristics..."
                    required
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sub-Area Title"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    placeholder="e.g., Sector 62 Residential"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    placeholder="Describe this sub-area..."
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <MapUpload
                    mapImage={formData.mapImage}
                    onMapChange={handleMapChange}
                    label="Sub-Area Map (Optional)"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={dialogType === 'area' ? handleSaveArea : handleSaveSubArea}
            variant="contained"
            disabled={
              dialogType === 'area' 
                ? !formData.key || !formData.name || !formData.description
                : !formData.title || !formData.description
            }
          >
            {(editingArea || editingSubArea) ? 'Update' : 'Add'}
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
        onClick={() => handleOpenAreaDialog()}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default Areas;