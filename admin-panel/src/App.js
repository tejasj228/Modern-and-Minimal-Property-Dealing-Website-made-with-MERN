import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext'; // 🆕 Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // 🆕 Import ProtectedRoute
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Areas from './pages/Areas';
import Images from './pages/Images';
import Contacts from './pages/Contacts';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#B8860B', // Gold color matching your website
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2c3e50',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider> {/* 🆕 Wrap entire app with AuthProvider */}
        <Router>
          <ProtectedRoute> {/* 🆕 Wrap all routes with ProtectedRoute */}
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/areas" element={<Areas />} />
                <Route path="/images" element={<Images />} />
                <Route path="/contacts" element={<Contacts />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;