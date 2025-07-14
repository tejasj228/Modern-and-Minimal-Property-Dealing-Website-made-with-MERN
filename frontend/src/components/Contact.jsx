import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear any previous error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      console.log('📤 Submitting contact form:', formData);
      
<<<<<<< HEAD
      // 🆕 UPDATED API URL for production
      const API_URL = process.env.NODE_ENV === 'production' 
        ? 'https://pawan-buildhome-backend-d8vm7thpr.vercel.app/api/contacts'
        : 'http://localhost:5000/api/contacts';
      
      // Submit to backend API
=======
      // 🆕 FIXED API URL - Force use Render backend (working one)
      const API_URL = 'https://property-dealing-backend.onrender.com/api/contacts';
      
      // Debug logs
      console.log('🔗 Environment REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
      console.log('🔗 Forcing API URL to:', API_URL);
      
      console.log('🔗 Using API URL:', API_URL);
      console.log('🔗 Environment:', process.env.NODE_ENV);
      
      // Submit to backend API with explicit headers
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
      const response = await axios.post(API_URL, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        interest: formData.interest.trim(),
        message: formData.message.trim()
<<<<<<< HEAD
=======
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // Increased timeout
        withCredentials: false // Disable credentials for CORS
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
      });
      
      console.log('✅ Contact form submitted successfully:', response.data);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
<<<<<<< HEAD
      
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
=======
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      });
      
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        setSubmitError('Network error. Please check your connection and try again.');
      } else if (error.code === 'ECONNREFUSED') {
        setSubmitError('Unable to connect to server. Please try again later.');
>>>>>>> 52345b40bccaacc373a33ab3f10d65f254fd6ea5
      } else {
        setSubmitError('Failed to send message. Please try again or contact us directly.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 🆕 FUNCTIONAL CONTACT METHODS
  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handlePhoneClick = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleLocationClick = () => {
    // Open Google Maps with the address
    const address = "S-1 Skytech Matrott Market, Sector-76, Noida (U.P) 201307";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  // 🆕 UPDATED CONTACT ITEMS with functional handlers
  const contactItems = [
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      content: 'pawan127jitendra@gmail.com',
      onClick: () => handleEmailClick('pawan127jitendra@gmail.com')
    },
    {
      icon: 'fas fa-phone',
      title: 'Call Us',
      content: '+91-9811186086\n+91-9811186083',
      onClick: () => handlePhoneClick('+91-9811186086') // Primary number
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Visit Us',
      content: 'S-1 Skytech Matrott Market\nSector-76, Noida (U.P) 201307',
      onClick: handleLocationClick
    },
    {
      icon: 'fas fa-clock',
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 5:00 PM',
      onClick: null // No action for working hours
    }
  ];

  return (
    <div className="contact-page">
      <div className="container">
        <div className="section-title">
          <h2>Contact Us</h2>
          <p>Get in touch with our expert team for personalized real estate solutions</p>
        </div>
        
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <div className="contact-items-wrapper">
              {contactItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`contact-item ${item.onClick ? 'contact-item-clickable' : ''}`}
                  onClick={item.onClick}
                  style={item.onClick ? { cursor: 'pointer' } : { cursor: 'default' }}
                >
                  <div className="contact-item-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="contact-item-content">
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form">
            <h3>Send Us a Message</h3>
            
            {/* Success Message */}
            {submitSuccess && (
              <div className="form-message success">
                <i className="fas fa-check-circle"></i>
                <p>Thank you for your message! We will get back to you soon.</p>
              </div>
            )}
            
            {/* Error Message */}
            {submitError && (
              <div className="form-message error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{submitError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="interest">Area of Interest</label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="">Select an area</option>
                  <option value="central-noida">Central Noida</option>
                  <option value="noida-expressway">Noida Greater Noida Expressway</option>
                  <option value="yamuna-expressway">Yamuna Expressway</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  disabled={submitting}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;