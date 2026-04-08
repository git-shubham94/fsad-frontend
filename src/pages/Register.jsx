// ============================================================
// src/pages/Register.jsx
// ✅ REAL API: POST /students/register
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { registerStudent } = useAppContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    department: '',
    cohort: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.cohort.trim()) newErrors.cohort = 'Cohort is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // ✅ REAL API CALL via AppContext → POST /students/register
    const result = await registerStudent(formData);

    setIsLoading(false);

    if (result.success) {
      toast.success('🎉 Registration successful! Redirecting to login...', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark'
      });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      if (result.error?.includes('Email already exists')) {
        toast.error('❌ Email already registered! Please use a different email.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark'
        });
      } else {
        toast.error(`❌ ${result.error || 'Registration failed. Please try again.'}`, {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark'
        });
      }
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />

      <motion.button
        className="back-to-home"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
      >
        ← Back to Home
      </motion.button>

      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join the Student Achievement Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@college.edu"
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={errors.confirmPassword ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g., 21BCE001"
                className={errors.rollNumber ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.rollNumber && <span className="error-text">{errors.rollNumber}</span>}
            </div>

            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? 'error' : ''}
                disabled={isLoading}
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics &amp; Communication (ECE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="MECH">Mechanical Engineering</option>
                <option value="CIVIL">Civil Engineering</option>
                <option value="EEE">Electrical Engineering (EEE)</option>
              </select>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cohort/Year *</label>
              <input
                type="text"
                name="cohort"
                value={formData.cohort}
                onChange={handleChange}
                placeholder="e.g., 2021-2025"
                className={errors.cohort ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.cohort && <span className="error-text">{errors.cohort}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contact number"
                disabled={isLoading}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="register-btn"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? '⏳ Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className="login-link">
          Already have an account?
          <button onClick={() => navigate('/login')} disabled={isLoading}>Login here</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
