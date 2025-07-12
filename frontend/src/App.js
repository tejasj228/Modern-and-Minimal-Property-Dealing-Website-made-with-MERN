import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Contact from './components/Contact';
import Listings from './components/Listings';
import Properties from './components/Properties';
import PropertyDetail from './components/PropertyDetail'; // 🆕 Import PropertyDetail
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
            {/* 🆕 New Property Detail Route */}
            <Route path="/property/:id" element={
              <PageTransition>
                <PropertyDetail />
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