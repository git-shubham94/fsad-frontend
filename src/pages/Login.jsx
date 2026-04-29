// ============================================================
// src/pages/Login.jsx
// ✅ REAL API: POST /students/login
// Admin login remains frontend-only (no backend admin model).
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { loginStudent } from '../api/api';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { setCurrentUser, refreshData } = useAppContext();
  const navigate = useNavigate();

  // ─── Generate random CAPTCHA ───────────────────────────────
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(captcha);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // ─── Handle Login Submit ───────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Verify captcha first
    if (captchaInput !== captchaCode) {
      setErrorMsg('❌ Invalid captcha! Please try again.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      // ─── Unified Login via Backend ──────────
      console.log('[LOGIN] Attempting login for:', email);
      const response = await loginStudent(email, password);
      
      const { token, user } = response;
      localStorage.setItem('jwt_token', token);
      setCurrentUser(user);

      console.log('[LOGIN] Login successful:', user);
      
      // ✅ Reload global dashboard data now that we have a secure token!
      await refreshData();

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      if (err.status === 401) {
        setErrorMsg('❌ Invalid email or password!');
      } else {
        setErrorMsg('❌ Server error. Please check if the backend is running.');
      }
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Back Button */}
      <motion.button
        className="back-home-btn"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
      >
        ← Back to Home
      </motion.button>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
  
          <h1>Welcome!</h1>
          <p>Access the portal</p>
        </div>

        {/* ✅ Error Message Display */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: '#f87171',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group captcha-group">
            <label>Verify you are human</label>
            <div className="captcha-container">
              <div className="captcha-display">{captchaCode}</div>
              <button
                type="button"
                className="captcha-refresh"
                onClick={generateCaptcha}
                title="Refresh Captcha"
                disabled={isLoading}
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter code"
              required
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          <motion.button
            type="submit"
            className="login-btn"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? '⏳ Logging in...' : 'Login'}
          </motion.button>
        </form>

        <div className="register-link">
          Don't have an account?
          <button onClick={() => navigate('/register')} disabled={isLoading}>Register here</button>
        </div>
        <div className="demo-credentials">
          <div className="demo-header">
          <span className="demo-icon">🔑</span>
          <strong>Credentials</strong>
          </div>

        <div className="demo-list">
        <div className="demo-item">
        <span className="role-badge student-badge">Admin</span>
        <span className="email">admin@college.edu</span>
        <span className="password-hint">admin123</span>
        </div>

        <div className="demo-item">
        <span className="role-badge student-badge">Student</span>
        <span className="email">kumarshubham32694@gmail.com</span>
        <span className="password-hint">• 123456</span>
        </div>

    <div className="demo-item">
 
  <span className="email">For rest register your own account</span>
</div>
  </div>
</div>
      </motion.div>
    </div>
  );
};

export default Login;
