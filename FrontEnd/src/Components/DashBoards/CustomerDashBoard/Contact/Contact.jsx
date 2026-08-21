import React, { useState } from "react";
import "./Contact.css";
import Swal from "sweetalert2";
import axios from "axios";

const BASE_URL = "http://localhost:8095/api";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/contact`, formData);
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "We will get back to you as soon as possible.",
        confirmButtonColor: "#263c33",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>Have questions about a property or our services? We're here to help.</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>Fill up the form and our team will get back to you within 24 hours.</p>
          
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <h3>Location</h3>
              <p>6-5-133,Balanagar,Hyderabad,500042</p>
            </div>
          </div>
          
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <h3>Phone</h3>
              <p>+91-8142253035</p>
            </div>
          </div>
          
          <div className="info-item">
            <span className="info-icon">✉️</span>
            <div>
              <h3>Email</h3>
              <p>tarunsai04062002@gmail.com</p>
            </div>
          </div>

          {/* <div className="social-links">
            <a href="#" className="social-icon">Instagram</a>
            <a href="#" className="social-icon">Facebook</a>
            <a href="#" className="social-icon">LinkedIn</a>
          </div> */}
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Your Email</label>
              <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Subject</label>
              <input type="text" name="subject" placeholder="Property Inquiry" value={formData.subject} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" placeholder="How can we help you?" rows="5" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
