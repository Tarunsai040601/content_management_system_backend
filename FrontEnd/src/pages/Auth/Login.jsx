import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomer as loginApi } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginCustomer } = useAuth();
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
        if (res.data.user && res.data.user.role === 'admin') {
          toast.error('You are an Admin. Please login via Admin Portal.');
          return;
        }
        localStorage.setItem('customerUser', JSON.stringify(res.data.user));
        loginCustomer(res.data.token);
        toast.success('Login successful!');
        navigate('/customer/dashboard');
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your account to save favorites and more.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
