import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import AchievementShowcase from '../features/student/AchievementShowcase';
import DashboardStats from '../features/student/DashboardStats';
import ParticipationTimeline from '../features/student/ParticipationTimeline';
import AchievementChart from '../components/ui/AchievementChart';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('achievements');
  const { currentUser, setCurrentUser, achievementList, participationList } = useAppContext();
  const navigate = useNavigate();

  // ✅ Use Number() to avoid string/number type mismatch from JSON
  const myAchievements = achievementList.filter(a => Number(a.studentId) === Number(currentUser?.id));
  const myParticipations = participationList.filter(p => Number(p.studentId) === Number(currentUser?.id));

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const menuItems = [
    { id: 'achievements', icon: '🏆', label: 'Achievements' },
    { id: 'participation', icon: '🎯', label: 'Participation' }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <motion.nav
        className="sidebar"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sidebar-header">
          <h2>Student Portal</h2>
        </div>

        <div className="profile-section">
          <div className="avatar">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <strong>{currentUser?.name}</strong>
          <span className="roll-number">{currentUser?.rollNumber}</span>
          <span className="department">{currentUser?.department}</span>
          <span className="role-badge">Student</span>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activeTab === item.id ? 'active' : ''}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </li>
          ))}

          <li className="logout-btn" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            Logout
          </li>
        </ul>

        {/* Quick Stats in Sidebar */}
        <div style={{ marginTop: 'auto', padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '0.5px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Quick Stats</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
            <span>🏆 Achievements</span>
            <span style={{ color: 'var(--primary)' }}>{myAchievements.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span>🎯 Participations</span>
            <span style={{ color: 'var(--secondary)' }}>{myParticipations.length}</span>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="main-content">
        <motion.header
          className="dashboard-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1>My Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, keep pushing your limits! 🚀</p>
          </div>
          <div className="header-trophy">🏅</div>
        </motion.header>

        <DashboardStats
          achievements={myAchievements}
          participations={myParticipations}
        />

        {myAchievements.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <AchievementChart achievements={myAchievements} />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'achievements' && (
              <AchievementShowcase achievements={myAchievements} />
            )}

            {activeTab === 'participation' && (
              <ParticipationTimeline participations={myParticipations} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentDashboard;
