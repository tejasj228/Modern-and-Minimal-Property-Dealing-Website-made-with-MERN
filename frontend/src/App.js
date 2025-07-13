// frontend/src/App.js - Updated with societies route
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Contact from './components/Contact';
import Listings from './components/Listings';
import Properties from './components/Properties';
import PropertyDetail from './components/PropertyDetail';
import Societies from './components/Societies'; // 🆕 NEW: Import Societies component
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <PageTransition>
                <Home />
              </PageTransition>
            } />
            <Route path="/contact" element={
              <PageTransition>
                <Contact />
              </PageTransition>
            } />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={
              <PageTransition>
                <PropertyDetail />
              </PageTransition>
            } />
            {/* 🆕 NEW: Societies route */}
            <Route path="/societies/:areaKey/:subAreaId" element={
              <PageTransition>
                <Societies />
              </PageTransition>
            } />
            <Route path="/listings/:area" element={
              <PageTransition>
                <Listings />
              </PageTransition>
            } />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;