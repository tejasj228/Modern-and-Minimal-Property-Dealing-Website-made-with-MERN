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
      
      // Submit to backend API
      const response = await axios.post('http://localhost:5000/api/contacts', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        interest: formData.interest.trim(),
        message: formData.message.trim()
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
      
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError('Failed to send message. Please try again or contact us directly.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      content: 'pawan127jitendra@gmail.com'
    },
    {
      icon: 'fas fa-phone',
      title: 'Call Us',
      content: '+91-9811186086\n+91-9811186083'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Visit Us',
      content: 'S-1 Skytech Matrott Market\nSector-76, Noida (U.P) 201307'
    },
    {
      icon: 'fas fa-clock',
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 5:00 PM'
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
                <div key={index} className="contact-item">
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
            
            {/* 🆕 FIXED: Removed HTML5 validation and noValidate added */}
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