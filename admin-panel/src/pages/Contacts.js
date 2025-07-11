import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  Badge,
  Divider,
  Stack,
  Avatar,
  Tooltip,
  Link,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Priority as PriorityIcon,
  Schedule as TimeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { contactAPI } from '../services/api';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contacts-tabpanel-${index}`}
      aria-labelledby={`contacts-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// 🆕 Message Display Component with Expand/Collapse
const MessageDisplay = ({ message, maxLength = 100 }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (message.length <= maxLength) {
    return (
      <Typography variant="body2" sx={{ lineHeight: 1.4, wordBreak: 'break-word' }}>
        {message}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ lineHeight: 1.4, wordBreak: 'break-word' }}>
        {expanded ? message : `${message.substring(0, maxLength)}...`}
      </Typography>
      <Button
        size="small"
        onClick={() => setExpanded(!expanded)}
        startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{ 
          mt: 0.5, 
          minWidth: 'auto',
          fontSize: '0.75rem',
          padding: '2px 8px'
        }}
      >
        {expanded ? 'Show Less' : 'Read More'}
      </Button>
    </Box>
  );
};

// Status and Priority mappings
const statusOptions = [
  { value: 'new', label: 'New', color: 'primary' },
  { value: 'contacted', label: 'Contacted', color: 'info' },
  { value: 'in-progress', label: 'In Progress', color: 'warning' },
  { value: 'closed', label: 'Closed', color: 'success' },
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'default' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'error' },
];

const getStatusColor = (status) => {
  const option = statusOptions.find(opt => opt.value === status);
  return option?.color || 'default';
};

const getPriorityColor = (priority) => {
  const option = priorityOptions.find(opt => opt.value === priority);
  return option?.color || 'default';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

function Contacts() {
  const [tabValue, setTabValue] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    isRead: '',
    search: ''
  });
  
  // Dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    priority: '',
    notes: ''
  });

  useEffect(() => {
    loadContacts();
    loadStats();
  }, [page, rowsPerPage, filters, tabValue]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      };
      
      // Add tab-specific filters
      if (tabValue === 1) params.isRead = 'false'; // Unread
      if (tabValue === 2) params.status = 'new'; // New
      if (tabValue === 3) params.status = 'in-progress'; // In Progress
      
      const response = await contactAPI.getAll(params);
      setContacts(response.data || []);
      setTotalContacts(response.pagination?.totalContacts || 0);
      
    } catch (error) {
      console.error('Error loading contacts:', error);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await contactAPI.getStats();
      setStats(response.data || {});
    } catch (error) {
      console.error('Error loading contact stats:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0); // Reset to first page when changing tabs
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0); // Reset to first page when filtering
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setOpenViewDialog(true);
    
    // Mark as read if not already read
    if (!contact.isRead) {
      markAsRead(contact._id);
    }
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setEditFormData({
      status: contact.status || '',
      priority: contact.priority || '',
      notes: contact.notes || ''
    });
    setOpenEditDialog(true);
  };

  const handleSaveContact = async () => {
    try {
      await contactAPI.update(selectedContact._id, editFormData);
      setOpenEditDialog(false);
      loadContacts();
      loadStats();
    } catch (error) {
      console.error('Error updating contact:', error);
      setError('Failed to update contact');
    }
  };

  const markAsRead = async (contactId) => {
    try {
      await contactAPI.markAsRead(contactId);
      loadContacts();
      loadStats();
    } catch (error) {
      console.error('Error marking contact as read:', error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactAPI.delete(contactId);
        loadContacts();
        loadStats();
      } catch (error) {
        console.error('Error deleting contact:', error);
        setError('Failed to delete contact');
      }
    }
  };

  if (loading && contacts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Contacts...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Contact Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage customer inquiries and leads
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Contacts
                  </Typography>
                  <Typography variant="h4">{stats.totalContacts || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Unread
                  </Typography>
                  <Typography variant="h4">{stats.unreadCount || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <MarkReadIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    New
                  </Typography>
                  <Typography variant="h4">{stats.newCount || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <MessageIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Recent (30 days)
                  </Typography>
                  <Typography variant="h4">{stats.recentCount || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TimeIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search name, email, message..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Read Status</InputLabel>
                <Select
                  value={filters.isRead}
                  onChange={(e) => handleFilterChange('isRead', e.target.value)}
                  label="Read Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="false">Unread</MenuItem>
                  <MenuItem value="true">Read</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={() => {
                  setFilters({ status: '', priority: '', isRead: '', search: '' });
                  setPage(0);
                }}
                startIcon={<FilterIcon />}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label={`All Contacts (${stats.totalContacts || 0})`}
          />
          <Tab 
            label={
              <Badge badgeContent={stats.unreadCount || 0} color="error">
                Unread
              </Badge>
            }
          />
          <Tab 
            label={`New (${stats.statusCounts?.new || 0})`}
          />
          <Tab 
            label={`In Progress (${stats.statusCounts?.['in-progress'] || 0})`}
          />
        </Tabs>
      </Box>

      {/* 🆕 IMPROVED Contacts Table with better layout */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '20%' }}>Contact Info</TableCell>
                <TableCell sx={{ width: '35%' }}>Message</TableCell> {/* 🆕 Increased width */}
                <TableCell sx={{ width: '10%' }}>Status</TableCell>
                <TableCell sx={{ width: '10%' }}>Priority</TableCell>
                <TableCell sx={{ width: '15%' }}>Date</TableCell>
                <TableCell sx={{ width: '10%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow 
                  key={contact._id}
                  sx={{ 
                    backgroundColor: !contact.isRead ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {!contact.isRead && <Badge color="primary" variant="dot" sx={{ mr: 1 }} />}
                        {contact.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                          {contact.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="caption">{contact.phone}</Typography>
                      </Stack>
                      {contact.interest && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="caption">{contact.interest}</Typography>
                        </Stack>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: '350px' }}> {/* 🆕 Added max width */}
                    <MessageDisplay message={contact.message} maxLength={150} />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={contact.status} 
                      color={getStatusColor(contact.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={contact.priority} 
                      color={getPriorityColor(contact.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {formatDate(contact.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewContact(contact)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditContact(contact)}
                          color="info"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {!contact.isRead && (
                        <Tooltip title="Mark as Read">
                          <IconButton 
                            size="small" 
                            onClick={() => markAsRead(contact._id)}
                            color="warning"
                          >
                            <MarkReadIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteContact(contact._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalContacts}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* View Contact Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Contact Details</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                    <Typography variant="body1">{selectedContact.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                    <Link href={`mailto:${selectedContact.email}`} variant="body1">
                      {selectedContact.email}
                    </Link>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                    <Link href={`tel:${selectedContact.phone}`} variant="body1">
                      {selectedContact.phone}
                    </Link>
                  </Box>
                  {selectedContact.interest && (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Area of Interest</Typography>
                      <Typography variant="body1">{selectedContact.interest}</Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Status & Details</Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Chip 
                      label={selectedContact.status} 
                      color={getStatusColor(selectedContact.status)}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Priority</Typography>
                    <Chip 
                      label={selectedContact.priority} 
                      color={getPriorityColor(selectedContact.priority)}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Received</Typography>
                    <Typography variant="body1">{formatDate(selectedContact.createdAt)}</Typography>
                  </Box>
                  {selectedContact.notes && (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                      <Typography variant="body1">{selectedContact.notes}</Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Complete Message</Typography>
                <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {selectedContact.message}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setOpenViewDialog(false);
              handleEditContact(selectedContact);
            }}
          >
            Edit Contact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editFormData.priority}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priority"
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={editFormData.notes}
                onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes about this contact..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveContact}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Contacts;