import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { exportStudentReportPDF } from '../../utils/exportUtils';

const AchievementShowcase = ({ achievements }) => {
  const { currentUser, participationList, activityCategories } = useAppContext();

  const studentParticipations = participationList.filter(
    p => Number(p.studentId) === Number(currentUser?.id)
  );

  const getCategoryDetails = (activityCategoryId) => {
    return activityCategories?.find(cat => cat.id === activityCategoryId) || null;
  };

  const groupByCategory = achievements.reduce((acc, achievement) => {
    acc[achievement.category] = acc[achievement.category] || [];
    acc[achievement.category].push(achievement);
    return acc;
  }, {});

  const categoryLabels = {
    award: '🏆 Awards',
    recognition: '⭐ Recognitions',
    participation: '🎯 Participations'
  };

  const categoryColors = {
    award: '#534AB7',
    recognition: '#1D9E75',
    participation: '#BA7517'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="achievement-showcase">

      {/* ── Export Portfolio Bar ───────────────── */}
      <motion.div
        className="export-portfolio-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="export-portfolio-left">
          <div className="export-portfolio-icon-wrap">📋</div>
          <div className="export-portfolio-text">
            <h4>My Achievement Portfolio</h4>
            <p>
              {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {studentParticipations.length} participation{studentParticipations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <motion.button
          className="export-portfolio-btn"
          onClick={() => exportStudentReportPDF(currentUser, achievements, studentParticipations)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📄 Export Portfolio PDF
        </motion.button>
      </motion.div>

      {/* ── Achievement Categories ─────────────── */}
      {Object.entries(groupByCategory).map(([category, items]) => {
        const label = categoryLabels[category] || category;
        const color = categoryColors[category] || '#667eea';

        return (
          <div key={category} className="category-section">
            <motion.div
              className="category-heading"
              style={{ borderLeft: `5px solid ${color}` }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="category-heading-label">{label}</span>
              <span
                className="category-count-badge"
                style={{ background: color, color: category === 'award' ? '#2c3e50' : 'white' }}
              >
                {items.length}
              </span>
            </motion.div>

            <motion.div
              className="achievement-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {items.map((achievement) => {
                const activityCat = getCategoryDetails(achievement.activityCategory);

                return (
                  <motion.div
                    key={achievement.id}
                    className="achievement-card"
                    style={{ borderTop: `4px solid ${color}` }}
                    variants={cardVariants}
                    whileHover={{
                      y: -10,
                      boxShadow: `0 20px 40px rgba(0,0,0,0.2)`,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <h3>{achievement.title}</h3>
                    <p className="description">{achievement.description}</p>

                    {/* Activity Type Badge */}
                    {activityCat && (
                      <div
                        className="activity-type-badge"
                        style={{
                          background: `${activityCat.color}20`,
                          border: `1.5px solid ${activityCat.color}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          marginBottom: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: activityCat.color
                        }}
                      >
                        <span>{activityCat.icon}</span>
                        <span>{activityCat.name}</span>
                      </div>
                    )}

                    <div className="card-footer">
                      <motion.span
                        className="category-tag"
                        style={
                          category === 'award' 
                          ? { background: '#FAEEDA', color: '#854F0B', fontSize: '11px', borderRadius: '20px', padding: '3px 10px' }
                          : { background: color, color: 'white', fontSize: '11px', borderRadius: '20px', padding: '3px 10px' }
                        }
                        whileHover={{ scale: 1.1 }}
                      >
                        {category.toUpperCase()}
                      </motion.span>
                      <span className="date">
                        📅 {new Date(achievement.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        );
      })}

      {/* ── No Data ───────────────────────────── */}
      {achievements.length === 0 && (
        <motion.div
          className="no-data"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p style={{ fontSize: '48px' }}>📭</p>
          <p>No achievements recorded yet.</p>
          <p>Contact your admin to add your achievements!</p>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementShowcase;
