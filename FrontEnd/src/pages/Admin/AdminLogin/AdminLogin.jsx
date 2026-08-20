import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin as loginApi } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await loginApi(formData);
      if (res.data && res.data.token) {
        // Technically backend should return role or we decode JWT to verify admin
        // For this project, if they login here, we assume admin or check if there's a role field
        loginAdmin(res.data.token);
        toast.success('Admin Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-icon-wrapper">
            <FiLock className="admin-lock-icon" />
          </div>
          <h2>Admin Portal</h2>
          <p>Login to manage properties</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Admin Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="admin@example.com"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter password"
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block auth-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
