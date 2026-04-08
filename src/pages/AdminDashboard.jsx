import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import AchievementForm from '../features/admin/AchievementForm';
import ParticipationForm from '../features/admin/ParticipationForm';
import StudentList from '../features/admin/StudentList';
import AchievementChart from '../components/ui/AchievementChart';
import { exportToCSV, exportAchievementsToPDF, exportParticipationsToPDF } from '../utils/exportUtils';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    currentUser,
    setCurrentUser,
    achievementList,
    participationList,
    students
  } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const totalAchievements = achievementList.length;
  const totalAwards = achievementList.filter(a => a.category === 'award').length;
  const totalRecognitions = achievementList.filter(a => a.category === 'recognition').length;
  // ✅ FIXED: was wrongly reading from achievementList — now uses participationList
  const totalParticipations = participationList.length;

  // ✅ Exclude the admin account from the active student count mathematically
  const activeStudents = students.filter(s => s.role !== 'ADMIN');

  const menuItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'add-achievement', icon: '➕', label: 'Add Achievement' },
    { id: 'add-participation', icon: '🎯', label: 'Add Participation' },
    { id: 'students', icon: '👥', label: 'View Students' },
    { id: 'export', icon: '📥', label: 'Export Data' }
  ];

  // CSV Export Handlers
  const handleExportAchievementsCSV = () => {
    const csvData = achievementList.map(a => {
      const student = students.find(s => Number(s.id) === Number(a.studentId));
      return {
        StudentName: student?.name || 'N/A',
        RollNumber: student?.rollNumber || 'N/A',
        Department: student?.department || 'N/A',
        Title: a.title,
        Category: a.category,
        ActivityType: a.activityCategory || 'N/A',
        Description: a.description,
        Date: new Date(a.date).toLocaleDateString('en-IN')
      };
    });
    exportToCSV(csvData, 'achievements');
  };

  const handleExportParticipationsCSV = () => {
    const csvData = participationList.map(p => {
      const student = students.find(s => Number(s.id) === Number(p.studentId));
      return {
        StudentName: student?.name || 'N/A',
        RollNumber: student?.rollNumber || 'N/A',
        Department: student?.department || 'N/A',
        ActivityName: p.activityName,
        Category: p.activityCategory || 'N/A',
        Role: p.role,
        Duration: p.duration,
        Skills: Array.isArray(p.skills) ? p.skills.join(', ') : p.skills
      };
    });
    exportToCSV(csvData, 'participations');
  };

  const handleExportStudentsCSV = () => {
    const csvData = activeStudents.map(s => ({
      Name: s.name,
      RollNumber: s.rollNumber,
      Email: s.email,
      Department: s.department,
      Cohort: s.cohort,
      Phone: s.phone || 'N/A',
      Achievements: achievementList.filter(a => Number(a.studentId) === Number(s.id)).length,
      Participations: participationList.filter(p => Number(p.studentId) === Number(s.id)).length
    }));
    exportToCSV(csvData, 'students');
  };

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
          <h2>Admin Panel</h2>
        </div>

        <div className="profile-section">
          <div className="admin-avatar">👨‍💼</div>
          <strong>{currentUser?.name}</strong>
          <span className="role-badge">Administrator</span>
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
            <h1>Welcome, Admin! 👋</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage student achievements and records
            </p>
          </div>
          <div className="header-trophy">🏆</div>
        </motion.header>

        <AnimatePresence mode="wait">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <div className="stats-container">
                <div className="stat-card-admin">
                  <div className="stat-icon-admin" style={{ background: 'rgba(102,126,234,0.2)', color: '#667eea' }}>🏆</div>
                  <div className="stat-content">
                    <h3>{totalAchievements}</h3>
                    <p>Total Achievements</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin" style={{ background: 'rgba(255,215,0,0.2)', color: '#ffd700' }}>🥇</div>
                  <div className="stat-content">
                    <h3>{totalAwards}</h3>
                    <p>Awards</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin" style={{ background: 'rgba(255,107,107,0.2)', color: '#ff6b6b' }}>⭐</div>
                  <div className="stat-content">
                    <h3>{totalRecognitions}</h3>
                    <p>Recognitions</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin" style={{ background: 'rgba(78,205,196,0.2)', color: '#4ecdc4' }}>🎯</div>
                  <div className="stat-content">
                    <h3>{totalParticipations}</h3>
                    <p>Participations</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              {achievementList.length > 0 && (
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-light)',
                  marginBottom: '2rem'
                }}>
                  <AchievementChart achievements={achievementList} />
                </div>
              )}

              {/* Students Count */}
              <div className="stat-card-admin" style={{
                justifyContent: 'center',
                textAlign: 'center',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '3rem' }}>👥</div>
                <h3>{activeStudents.length}</h3>
                <p>Total Registered Students</p>
              </div>
            </motion.div>
          )}

          {/* ── ADD ACHIEVEMENT TAB ── */}
          {activeTab === 'add-achievement' && (
            <motion.div
              key="add-achievement"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementForm />
            </motion.div>
          )}

          {/* ── ADD PARTICIPATION TAB ── */}
          {activeTab === 'add-participation' && (
            <motion.div
              key="add-participation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ParticipationForm />
            </motion.div>
          )}

          {/* ── VIEW STUDENTS TAB ── */}
          {activeTab === 'students' && (
            <motion.div
              key="students"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StudentList />
            </motion.div>
          )}

          {/* ── EXPORT TAB ── */}
          {activeTab === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="export-page">
                <h2>📥 Export Data</h2>
                <p className="export-subtitle">
                  Download all records in PDF or CSV format
                </p>

                <div className="export-cards-grid">

                  {/* Achievements Export */}
                  <motion.div
                    className="export-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="export-card-icon" style={{ background: 'rgba(102,126,234,0.1)' }}>
                      🏆
                    </div>
                    <h3>Achievements Report</h3>
                    <p>Export all {achievementList.length} achievement records</p>
                    <div className="export-btn-group">
                      <motion.button
                        className="export-btn pdf-btn"
                        onClick={() => exportAchievementsToPDF(achievementList, students)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📄 Export PDF
                      </motion.button>
                      <motion.button
                        className="export-btn csv-btn"
                        onClick={handleExportAchievementsCSV}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📊 Export CSV
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Participations Export */}
                  <motion.div
                    className="export-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="export-card-icon" style={{ background: 'rgba(118,75,162,0.1)' }}>
                      🎯
                    </div>
                    <h3>Participations Report</h3>
                    <p>Export all {participationList.length} participation records</p>
                    <div className="export-btn-group">
                      <motion.button
                        className="export-btn pdf-btn"
                        onClick={() => exportParticipationsToPDF(participationList, students)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📄 Export PDF
                      </motion.button>
                      <motion.button
                        className="export-btn csv-btn"
                        onClick={handleExportParticipationsCSV}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📊 Export CSV
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Students Export */}
                  <motion.div
                    className="export-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="export-card-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
                      👥
                    </div>
                    <h3>Students List</h3>
                    <p>Export all {activeStudents.length} registered student records</p>
                    <div className="export-btn-group">
                      <motion.button
                        className="export-btn csv-btn"
                        onClick={handleExportStudentsCSV}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ width: '100%' }}
                      >
                        📊 Export CSV
                      </motion.button>
                    </div>
                  </motion.div>

                </div>

                

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
