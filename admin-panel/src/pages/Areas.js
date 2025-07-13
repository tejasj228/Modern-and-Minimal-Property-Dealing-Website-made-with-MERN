// admin-panel/src/pages/Areas.js - Updated with society management
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
  Collapse,
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
  Home as HomeIcon,
  ExpandLess as ExpandLessIcon,
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

// Map Upload Component (same as before)
const MapUpload = ({ mapImage, onMapChange, label = "Sub-Area Map" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      
      const response = await uploadAPI.uploadImage(file);
      onMapChange(response.data.imageUrl);
    } catch (error) {
      console.error('❌ Error uploading map:', error);
      setError(`Failed to upload map image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMap = () => {
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
              alt="Map preview"
              sx={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/assets/map.webp';
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
        Upload a map image (JPG, PNG, GIF, WebP)
      </Typography>
    </Box>
  );
};

// 🆕 NEW: Sortable Society Component
const SortableSociety = ({ society, areaKey, subAreaId, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `society-${areaKey}-${subAreaId}-${society.id}` });

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
      <HomeIcon sx={{ mr: 2, color: 'text.secondary' }} />
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1}>
            {society.name}
            {society.mapImage && (
              <Chip 
                icon={<MapIcon />} 
                label="Has Map" 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            )}
            {society.amenities && society.amenities.length > 0 && (
              <Chip 
                label={`${society.amenities.length} amenities`}
                size="small" 
                color="secondary" 
                variant="outlined"
              />
            )}
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="textSecondary">
              {society.description}
            </Typography>
            {society.contact && (
              <Typography variant="caption" color="textSecondary">
                Contact: {society.contact.phone || society.contact.email || 'Not provided'}
              </Typography>
            )}
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          size="small"
          onClick={() => onEdit(areaKey, subAreaId, society)}
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(areaKey, subAreaId, society.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// 🆕 UPDATED: Sortable Sub-Area Component with societies
const SortableSubArea = ({ 
  subArea, 
  areaKey, 
  onEdit, 
  onDelete, 
  onEditSociety, 
  onDeleteSociety, 
  onAddSociety,
  onSocietyReorder 
}) => {
  const [expanded, setExpanded] = useState(false);
  
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

  // Set up sensors for society drag and drop
  const societySensors = useSensors(
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
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        border: isDragging ? '2px dashed #B8860B' : '1px solid #e0e0e0',
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Sub-area header */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
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
            >
              <DragIcon color="primary" />
            </Box>
            <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">{subArea.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {subArea.description}
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                {subArea.mapImage && (
                  <Chip 
                    icon={<MapIcon />} 
                    label="Has Map" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )}
                <Chip 
                  label={`${subArea.societies?.length || 0} societies`} 
                  size="small" 
                  color="secondary"
                />
              </Box>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              onClick={() => onEdit(areaKey, subArea)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(areaKey, subArea.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Societies section */}
        <Collapse in={expanded}>
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Societies in {subArea.title}</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => onAddSociety(areaKey, subArea.id)}
                variant="outlined"
              >
                Add Society
              </Button>
            </Box>

            {subArea.societies && subArea.societies.length > 0 ? (
              <DndContext
                sensors={societySensors}
                collisionDetection={closestCenter}
                onDragEnd={(result) => onSocietyReorder(areaKey, subArea.id, result)}
              >
                <SortableContext
                  items={subArea.societies.map(s => `society-${areaKey}-${subArea.id}-${s.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <List>
                    {subArea.societies.map((society) => (
                      <SortableSociety
                        key={society.id}
                        society={society}
                        areaKey={areaKey}
                        subAreaId={subArea.id}
                        onEdit={onEditSociety}
                        onDelete={onDeleteSociety}
                      />
                    ))}
                  </List>
                </SortableContext>
              </DndContext>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                <HomeIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  No societies yet. Add some societies to organize this sub-area better.
                </Typography>
              </Paper>
            )}
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

// Main Areas component with updated dialogs and society management
function Areas() {
  const [areas, setAreas] = useState({});
  const [propertyCounts, setPropertyCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('area'); // 'area', 'subarea', or 'society'
  const [editingArea, setEditingArea] = useState(null);
  const [editingSubArea, setEditingSubArea] = useState(null);
  const [editingSociety, setSEditingSociety] = useState(null); // 🆕 NEW
  const [parentAreaKey, setParentAreaKey] = useState(null);
  const [parentSubAreaId, setParentSubAreaId] = useState(null); // 🆕 NEW
  const [activeId, setActiveId] = useState(null);
  
  // 🆕 UPDATED: Form data now includes society fields
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    title: '',
    mapImage: null,
    // 🆕 Society fields
    amenities: '',
    contactPhone: '',
    contactEmail: '',
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
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

      setAreas(areasResponse.data || {});

      // Count properties by area
      const counts = {};
      if (propertiesResponse.data) {
        propertiesResponse.data.forEach(property => {
          counts[property.areaKey] = (counts[property.areaKey] || 0) + 1;
        });
      }
      setPropertyCounts(counts);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setError(`Failed to load areas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 NEW: Handle society reordering
  const handleSocietyReorder = async (areaKey, subAreaId, result) => {
    const { active, over } = result;

    if (over && active.id !== over.id) {
      setSavingOrder(true);
      
      const area = areas[areaKey];
      const subArea = area.subAreas.find(sa => sa.id === parseInt(subAreaId));
      
      // Extract the actual society IDs
      const activeSocietyId = parseInt(active.id.replace(`society-${areaKey}-${subAreaId}-`, ''));
      const overSocietyId = parseInt(over.id.replace(`society-${areaKey}-${subAreaId}-`, ''));
      
      const oldIndex = subArea.societies.findIndex(s => s.id === activeSocietyId);
      const newIndex = subArea.societies.findIndex(s => s.id === overSocietyId);

      const reorderedSocieties = arrayMove(subArea.societies, oldIndex, newIndex);

      // Update local state immediately
      const updatedSubArea = { ...subArea, societies: reorderedSocieties };
      const updatedArea = {
        ...area,
        subAreas: area.subAreas.map(sa => sa.id === parseInt(subAreaId) ? updatedSubArea : sa)
      };

      setAreas(prev => ({
        ...prev,
        [areaKey]: updatedArea
      }));

      try {
        // Persist to backend
        await areaAPI.update(areaKey, updatedArea);
        console.log('✅ Society order saved to backend');
        setError(null);
      } catch (error) {
        console.error('❌ Error updating society order:', error);
        setError('Failed to update society order');
        loadData();
      } finally {
        setSavingOrder(false);
      }
    }
  };

  // 🆕 NEW: Society dialog handlers
  const handleOpenSocietyDialog = (areaKey, subAreaId, society = null) => {
    console.log('🏘️ Opening society dialog:', areaKey, subAreaId, society);
    setDialogType('society');
    setEditingArea(null);
    setEditingSubArea(null);
    setSEditingSociety(society);
    setParentAreaKey(areaKey);
    setParentSubAreaId(subAreaId);
    
    if (society) {
      setFormData({
        key: '',
        name: society.name || '',
        description: society.description || '',
        title: '',
        mapImage: society.mapImage || null,
        amenities: society.amenities ? society.amenities.join(', ') : '',
        contactPhone: society.contact?.phone || '',
        contactEmail: society.contact?.email || '',
      });
    } else {
      setFormData({
        key: '',
        name: '',
        description: '',
        title: '',
        mapImage: null,
        amenities: '',
        contactPhone: '',
        contactEmail: '',
      });
    }
    setOpenDialog(true);
  };

  // 🆕 NEW: Save society
  const handleSaveSociety = async () => {
    try {
      console.log('💾 Saving society:', formData);
      const area = areas[parentAreaKey];
      const subAreaIndex = area.subAreas.findIndex(sa => sa.id === parseInt(parentSubAreaId));
      const subArea = area.subAreas[subAreaIndex];
      
      const societyData = {
        id: editingSociety ? editingSociety.id : Date.now(),
        name: formData.name,
        description: formData.description,
        mapImage: formData.mapImage,
        amenities: formData.amenities 
          ? formData.amenities.split(',').map(a => a.trim()).filter(a => a)
          : [],
        contact: {
          phone: formData.contactPhone || '',
          email: formData.contactEmail || ''
        },
        order: editingSociety ? editingSociety.order : (subArea.societies?.length || 0)
      };

      let updatedSocieties;
      if (editingSociety) {
        updatedSocieties = subArea.societies.map(s => 
          s.id === editingSociety.id ? societyData : s
        );
      } else {
        updatedSocieties = [...(subArea.societies || []), societyData];
      }

      const updatedSubArea = { ...subArea, societies: updatedSocieties };
      const updatedArea = {
        ...area,
        subAreas: area.subAreas.map((sa, idx) => 
          idx === subAreaIndex ? updatedSubArea : sa
        )
      };

      console.log('💾 Updated area data:', updatedArea);
      await areaAPI.update(parentAreaKey, updatedArea);

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('❌ Error saving society:', error);
      setError(`Failed to save society: ${error.message}`);
    }
  };

  // 🆕 NEW: Delete society
  const handleDeleteSociety = async (areaKey, subAreaId, societyId) => {
    if (window.confirm('Are you sure you want to delete this society?')) {
      try {
        console.log('🗑️ Deleting society:', societyId, 'from sub-area:', subAreaId);
        const area = areas[areaKey];
        const subAreaIndex = area.subAreas.findIndex(sa => sa.id === parseInt(subAreaId));
        const subArea = area.subAreas[subAreaIndex];
        
        const updatedSocieties = subArea.societies.filter(s => s.id !== societyId);
        const updatedSubArea = { ...subArea, societies: updatedSocieties };
        const updatedArea = {
          ...area,
          subAreas: area.subAreas.map((sa, idx) => 
            idx === subAreaIndex ? updatedSubArea : sa
          )
        };

        await areaAPI.update(areaKey, updatedArea);
        loadData();
      } catch (error) {
        console.error('❌ Error deleting society:', error);
        setError(`Failed to delete society: ${error.message}`);
      }
    }
  };

  // Existing handlers (area reordering, sub-area handling, etc. - keeping the same)
  const handleAreaDragEnd = async (result) => {
    const { active, over } = result;

    if (over && active.id !== over.id) {
      setSavingOrder(true);
      
      const activeAreaKey = active.id.replace('area-', '');
      const overAreaKey = over.id.replace('area-', '');
      
      const currentAreaKeys = Object.keys(areas);
      const oldIndex = currentAreaKeys.indexOf(activeAreaKey);
      const newIndex = currentAreaKeys.indexOf(overAreaKey);
      
      if (oldIndex === -1 || newIndex === -1) {
        console.error('❌ Invalid area keys for reordering');
        setSavingOrder(false);
        return;
      }

      const reorderedKeys = arrayMove(currentAreaKeys, oldIndex, newIndex);
      
      const reorderedAreas = {};
      reorderedKeys.forEach(key => {
        reorderedAreas[key] = areas[key];
      });
      setAreas(reorderedAreas);

      try {
        await areaAPI.reorder(reorderedKeys);
        console.log('✅ Areas order saved to backend');
        setError(null);
      } catch (error) {
        console.error('❌ Error saving areas order:', error);
        setError('Failed to save areas order');
        loadData();
      } finally {
        setSavingOrder(false);
      }
    }

    setActiveId(null);
  };

  const handleSubAreaReorder = async (areaKey, result) => {
    const { active, over } = result;

    if (over && active.id !== over.id) {
      setSavingOrder(true);
      
      const area = areas[areaKey];
      
      const activeSubAreaId = parseInt(active.id.replace(`subarea-${areaKey}-`, ''));
      const overSubAreaId = parseInt(over.id.replace(`subarea-${areaKey}-`, ''));
      
      const oldIndex = area.subAreas.findIndex(sa => sa.id === activeSubAreaId);
      const newIndex = area.subAreas.findIndex(sa => sa.id === overSubAreaId);

      const reorderedSubAreas = arrayMove(area.subAreas, oldIndex, newIndex);

      setAreas(prev => ({
        ...prev,
        [areaKey]: {
          ...area,
          subAreas: reorderedSubAreas
        }
      }));

      try {
        await areaAPI.reorderSubAreas(areaKey, reorderedSubAreas);
        console.log('✅ Sub-area order saved to backend');
        setError(null);
      } catch (error) {
        console.error('❌ Error updating sub-area order:', error);
        setError('Failed to update sub-area order');
        loadData();
      } finally {
        setSavingOrder(false);
      }
    }
  };

  // Existing dialog handlers (keeping the same but updated for society support)
  const handleOpenAreaDialog = (area = null) => {
    console.log('🔧 Opening area dialog:', area);
    setDialogType('area');
    setEditingArea(area);
    setEditingSubArea(null);
    setSEditingSociety(null);
    setParentAreaKey(null);
    setParentSubAreaId(null);
    
    if (area) {
      const areaKey = Object.keys(areas).find(key => areas[key].name === area.name);
      setFormData({
        key: areaKey || '',
        name: area.name || '',
        description: area.description || '',
        title: '',
        mapImage: null,
        amenities: '',
        contactPhone: '',
        contactEmail: '',
      });
    } else {
      setFormData({
        key: '',
        name: '',
        description: '',
        title: '',
        mapImage: null,
        amenities: '',
        contactPhone: '',
        contactEmail: '',
      });
    }
    setOpenDialog(true);
  };

  const handleOpenSubAreaDialog = (areaKey, subArea = null) => {
    console.log('🔧 Opening sub-area dialog:', areaKey, subArea);
    setDialogType('subarea');
    setEditingArea(null);
    setEditingSubArea(subArea);
    setSEditingSociety(null);
    setParentAreaKey(areaKey);
    setParentSubAreaId(null);
    
    if (subArea) {
      setFormData({
        key: '',
        name: '',
        description: subArea.description || '',
        title: subArea.title || '',
        mapImage: subArea.mapImage || null,
        amenities: '',
        contactPhone: '',
        contactEmail: '',
      });
    } else {
      setFormData({
        key: '',
        name: '',
        description: '',
        title: '',
        mapImage: null,
        amenities: '',
        contactPhone: '',
        contactEmail: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingArea(null);
    setEditingSubArea(null);
    setSEditingSociety(null);
    setParentAreaKey(null);
    setParentSubAreaId(null);
    setFormData({
      key: '',
      name: '',
      description: '',
      title: '',
      mapImage: null,
      amenities: '',
      contactPhone: '',
      contactEmail: '',
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleMapChange = (mapImageUrl) => {
    setFormData(prev => ({
      ...prev,
      mapImage: mapImageUrl
    }));
  };

  // Existing save handlers (keeping the same)
  const handleSaveArea = async () => {
    try {
      const areaData = {
        key: formData.key.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        description: formData.description,
        subAreas: editingArea ? areas[Object.keys(areas).find(key => areas[key].name === editingArea.name)]?.subAreas || [] : [],
      };

      if (editingArea) {
        const areaKey = Object.keys(areas).find(key => areas[key].name === editingArea.name);
        await areaAPI.update(areaKey, areaData);
      } else {
        await areaAPI.create(areaData);
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
      const area = areas[parentAreaKey];
      const subAreaData = {
        id: editingSubArea ? editingSubArea.id : Date.now(),
        title: formData.title,
        description: formData.description,
        mapImage: formData.mapImage,
        societies: editingSubArea ? editingSubArea.societies || [] : [],
      };

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

      await areaAPI.update(parentAreaKey, updatedAreaData);

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('❌ Error saving sub-area:', error);
      setError(`Failed to save sub-area: ${error.message}`);
    }
  };

  // Existing delete handlers (keeping the same)
  const handleDeleteArea = async (areaKey) => {
    const propertyCount = propertyCounts[areaKey] || 0;
    if (propertyCount > 0) {
      setError(`Cannot delete area with ${propertyCount} properties. Remove properties first.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this area?')) {
      try {
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
        const area = areas[areaKey];
        const updatedSubAreas = area.subAreas.filter(sa => sa.id !== subAreaId);
        const updatedAreaData = {
          key: areaKey,
          name: area.name,
          description: area.description,
          subAreas: updatedSubAreas,
        };

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
            Manage your service areas, sub-areas, and societies • Drag to reorder
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

      {/* Areas List with Sub-areas and Societies */}
      {Object.keys(areas).length > 0 ? (
        <Box>
          {Object.entries(areas).map(([areaKey, area]) => (
            <Accordion key={areaKey} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center">
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
                        handleOpenAreaDialog(area);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteArea(areaKey);
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
                      onClick={() => handleOpenSubAreaDialog(areaKey)}
                    >
                      Add Sub-Area
                    </Button>
                  </Box>

                  {area.subAreas && area.subAreas.length > 0 ? (
                    <Box>
                      {area.subAreas.map((subArea) => (
                        <SortableSubArea
                          key={subArea.id}
                          subArea={subArea}
                          areaKey={areaKey}
                          onEdit={handleOpenSubAreaDialog}
                          onDelete={handleDeleteSubArea}
                          onEditSociety={handleOpenSocietyDialog}
                          onDeleteSociety={handleDeleteSociety}
                          onAddSociety={handleOpenSocietyDialog}
                          onSocietyReorder={handleSocietyReorder}
                        />
                      ))}
                    </Box>
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
          ))}
        </Box>
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

      {/* 🆕 UPDATED: Multi-purpose Dialog for Areas, Sub-areas, and Societies */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth={dialogType === 'society' ? 'md' : 'sm'}
      >
        <DialogTitle>
          {dialogType === 'area' && (editingArea ? 'Edit Area' : 'Add New Area')}
          {dialogType === 'subarea' && (editingSubArea ? 'Edit Sub-Area' : 'Add New Sub-Area')}
          {dialogType === 'society' && (editingSociety ? 'Edit Society' : 'Add New Society')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType === 'area' && (
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
            )}
            
            {dialogType === 'subarea' && (
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
            
            {/* 🆕 NEW: Society form fields */}
            {dialogType === 'society' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Society Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="e.g., Green Valley Apartments"
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
                    placeholder="Describe this society..."
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amenities"
                    value={formData.amenities}
                    onChange={handleInputChange('amenities')}
                    placeholder="e.g., Swimming Pool, Gym, Parking, Security (comma separated)"
                    helperText="Enter amenities separated by commas"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={formData.contactPhone}
                    onChange={handleInputChange('contactPhone')}
                    placeholder="e.g., +91-9811186086"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    value={formData.contactEmail}
                    onChange={handleInputChange('contactEmail')}
                    placeholder="e.g., contact@society.com"
                  />
                </Grid>
                <Grid item xs={12}>
                  <MapUpload
                    mapImage={formData.mapImage}
                    onMapChange={handleMapChange}
                    label="Society Map (Optional)"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={() => {
              if (dialogType === 'area') handleSaveArea();
              else if (dialogType === 'subarea') handleSaveSubArea();
              else if (dialogType === 'society') handleSaveSociety();
            }}
            variant="contained"
            disabled={
              (dialogType === 'area' && (!formData.key || !formData.name || !formData.description)) ||
              (dialogType === 'subarea' && (!formData.title || !formData.description)) ||
              (dialogType === 'society' && (!formData.name || !formData.description))
            }
          >
            {(editingArea || editingSubArea || editingSociety) ? 'Update' : 'Add'}
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