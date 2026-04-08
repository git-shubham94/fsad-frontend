import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Home.css';
import trophy from '../assets/trophy.png';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🏆',
      title: 'Achievement Tracking',
      description: 'Comprehensive record of awards, recognitions, and participation certificates all in one place.',
      color: '#EEEDFE',
      accent: '#534AB7'
    },
    {
      icon: '⭐',
      title: 'Digital Portfolio',
      description: 'Build and showcase your extracurricular profile beyond academics.',
      color: '#FAEEDA',
      accent: '#BA7517'
    },
    {
      icon: '📊',
      title: 'Visual Analytics',
      description: 'Interactive charts and insights to track your achievement journey over time.',
      color: '#E1F5EE',
      accent: '#1D9E75'
    },
    {
      icon: '🎯',
      title: 'Participation History',
      description: 'Timeline view of all your club activities, events, and competitions.',
      color: '#E6F1FB',
      accent: '#378ADD'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '500+' },
    { label: 'Achievements', value: '1.2k' },
    { label: 'Events Tracked', value: '250+' },
    { label: 'Awards Given', value: '400+' }
  ];

  return (
    <div className="home-container">

      {/* Hero Section — Split Layout */}
      <section className="hero-section">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-eyebrow">
            <span className="badge">🥇 Awards</span>
            <span className="badge">⭐ Recognition</span>
            <span className="badge">🎯 Participation</span>
          </div>

          <h1>Student Achievement Platform</h1>

          <p className="hero-subtitle">
            Empower your success beyond the classroom. Track awards, recognitions,
            and participation — all in one professional portfolio.
          </p>

          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Login <span>→</span>
            </button>
            <button className="btn-secondary" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="trophy-wrapper">
            <img src={trophy} alt="Achievement Trophy" className="trophy-img" />
            <div className="trophy-glow" />
            {/* Floating stat pills around trophy */}
            <motion.div
              className="float-pill pill-top-left"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🏆 1.2k Achievements
            </motion.div>
            <motion.div
              className="float-pill pill-bottom-right"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              🎓 500+ Students
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
            {index < stats.length - 1 && <div className="stat-divider" />}
          </motion.div>
        ))}
      </section>

      {/* Features Section — Asymmetric Grid */}
      <section className="features-section" id="features">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Platform Features</h2>
          <p className="section-sub">Everything you need to track and showcase your achievements</p>
        </motion.div>

        <div className="features-grid">
          {/* Large featured card */}
          <motion.div
            className="feature-card feature-card-large"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ '--icon-bg': features[0].color, '--icon-accent': features[0].accent }}
          >
            <div className="feature-icon">{features[0].icon}</div>
            <h3>{features[0].title}</h3>
            <p>{features[0].description}</p>
            <div className="feature-tag">Core Feature</div>
          </motion.div>

          {/* Three smaller cards */}
          <div className="features-sub-grid">
            {features.slice(1).map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 1) * 0.1 }}
                style={{ '--icon-bg': feature.color, '--icon-accent': feature.accent }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>How It Works</h2>
          <p className="section-sub">Get started in four simple steps</p>
        </motion.div>

        <div className="steps-container">
          {[
            { step: '01', title: 'Secure Login', desc: 'Access your personalized dashboard with role-based authentication.' },
            { step: '02', title: 'Add Achievements', desc: 'Record awards, certificates, and participation details easily.' },
            { step: '03', title: 'Track Progress', desc: 'Monitor growth with real-time analytics and visual reports.' },
            { step: '04', title: 'Showcase Portfolio', desc: 'Display and share your achievement portfolio with anyone.' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="step-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="step-number">{item.step}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="cta-inner">
            <div className="cta-text">
              <h2>Ready to get started?</h2>
              <p>Join hundreds of students building their digital success portfolio today.</p>
            </div>
            <button className="btn-cta" onClick={() => navigate('/register')}>
              Get Started Now →
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <h3>Student Achievement Platform</h3>
            <p>Empowering students to track and showcase their extracurricular excellence in a digital age.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@sap.edu</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Student Achievement Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
