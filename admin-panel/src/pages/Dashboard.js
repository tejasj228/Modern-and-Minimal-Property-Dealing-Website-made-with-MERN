import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Map as MapIcon,
  Image as ImageIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon, // 🆕 Added EmailIcon
  MarkEmailUnread as UnreadIcon, // 🆕 Added UnreadIcon
} from '@mui/icons-material';
import { propertyAPI, areaAPI, uploadAPI, contactAPI, healthCheck } from '../services/api'; // 🆕 Added contactAPI

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.main`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalAreas: 0,
    totalImages: 0,
    totalContacts: 0, // 🆕 Added contact stats
    unreadContacts: 0, // 🆕 Added unread contacts
    recentProperties: [],
    recentContacts: [], // 🆕 Added recent contacts
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check backend health
      await healthCheck();
      setBackendStatus('connected');

      // Fetch all data in parallel
      const [propertiesData, areasData, imagesData, contactsData, contactStatsData] = await Promise.all([
        propertyAPI.getAll(),
        areaAPI.getAll(),
        uploadAPI.getFiles().catch(() => ({ data: [] })), // Handle if uploads endpoint fails
        contactAPI.getAll({ limit: 5 }).catch(() => ({ data: [] })), // 🆕 Get recent contacts
        contactAPI.getStats().catch(() => ({ data: {} })), // 🆕 Get contact statistics
      ]);

      setStats({
        totalProperties: propertiesData.count || 0,
        totalAreas: Object.keys(areasData.data || {}).length,
        totalImages: imagesData.count || 0,
        totalContacts: contactStatsData.data?.totalContacts || 0, // 🆕 Added
        unreadContacts: contactStatsData.data?.unreadCount || 0, // 🆕 Added
        recentProperties: propertiesData.data?.slice(0, 5) || [],
        recentContacts: contactsData.data || [], // 🆕 Added
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      setBackendStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
        Welcome to Pawan Buildhome Admin Panel
      </Typography>

      {/* Backend Status */}
      <Box mb={3}>
        {backendStatus === 'connected' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Backend connected successfully - All systems operational
          </Alert>
        )}
        {backendStatus === 'disconnected' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            ❌ Backend disconnected - {error}
          </Alert>
        )}
        {backendStatus === 'checking' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            🔄 Checking backend connection...
          </Alert>
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<HomeIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Areas"
            value={stats.totalAreas}
            icon={<MapIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Images"
            value={stats.totalImages}
            icon={<ImageIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Contacts" // 🆕 Updated from "Active Listings"
            value={stats.totalContacts}
            icon={<EmailIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* 🆕 Second row of statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unread Contacts"
            value={stats.unreadContacts}
            icon={<UnreadIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Listings"
            value={stats.totalProperties}
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Recent Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              📋 Recent Properties
            </Typography>
            {stats.recentProperties.length > 0 ? (
              <Box>
                {stats.recentProperties.map((property, index) => (
                  <Box
                    key={property._id}
                    sx={{
                      p: 2,
                      mb: index < stats.recentProperties.length - 1 ? 2 : 0,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                      🏠 {property.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                      📍 {property.location} • 💰 {property.price}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      🛏️ {property.beds} beds • 🚿 {property.baths} baths • 📐 {property.area}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  No properties found. Add some properties to get started.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 🆕 Recent Contacts Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              📧 Recent Contacts
            </Typography>
            {stats.recentContacts.length > 0 ? (
              <Box>
                {stats.recentContacts.map((contact, index) => (
                  <Box
                    key={contact._id}
                    sx={{
                      p: 2,
                      mb: index < stats.recentContacts.length - 1 ? 2 : 0,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      backgroundColor: contact.isRead ? '#fafafa' : '#e3f2fd',
                      '&:hover': {
                        backgroundColor: contact.isRead ? '#f0f0f0' : '#bbdefb',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                      👤 {contact.name}
                      {!contact.isRead && (
                        <Box component="span" sx={{ ml: 1, color: 'primary.main', fontWeight: 'normal' }}>
                          (New)
                        </Box>
                      )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                      📧 {contact.email} • 📱 {contact.phone}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                      💬 {contact.message.length > 60 
                        ? `${contact.message.substring(0, 60)}...` 
                        : contact.message
                      }
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                      🕐 {new Date(contact.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  No contact inquiries yet.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions - Updated */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              ⚡ Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  🏠 Add new properties
                </Typography>
              </Box>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  🗺️ Manage areas and sub-areas
                </Typography>
              </Box>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  📸 Upload property images
                </Typography>
              </Box>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  🖼️ Update slider images
                </Typography>
              </Box>
              {/* 🆕 Added contact management */}
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  📧 Manage customer inquiries
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;