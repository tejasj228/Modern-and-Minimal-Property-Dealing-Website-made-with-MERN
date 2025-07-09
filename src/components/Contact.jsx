import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      interest: '',
      message: ''
    });
  };

  const contactItems = [
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      content: 'shivaassociates.com@gmail.com'
    },
    {
      icon: 'fas fa-phone',
      title: 'Call Us',
      content: '+91-9999090047'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Visit Us',
      content: 'Noida, Uttar Pradesh, India'
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
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="interest">Area of Interest</label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                >
                  <option value="">Select an area</option>
                  <option value="central-noida">Central Noida</option>
                  <option value="noida-expressway">Noida Greater Noida Expressway</option>
                  <option value="yamuna-expressway">Yamuna Expressway</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;