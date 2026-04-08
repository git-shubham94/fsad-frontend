import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const ParticipationTimeline = () => {
  const { currentUser, participationList, activityCategories } = useAppContext();

  // ✅ Number() coercion handles string vs number type difference from JSON
  const studentParticipations = participationList.filter(
    p => Number(p.studentId) === Number(currentUser?.id)
  );

  const getCategoryDetails = (categoryId) => {
    return activityCategories?.find(cat => cat.id === categoryId) ||
      { icon: '🌟', name: 'Other', color: '#6366f1' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 80 }
    }
  };

  if (studentParticipations.length === 0) {
    return (
      <motion.div
        className="no-data"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p style={{ fontSize: '52px' }}>📋</p>
        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
          No Participation Records Yet
        </p>
        <p style={{ fontSize: '14px' }}>Your club activities will appear here once added by admin.</p>
      </motion.div>
    );
  }

  return (
    <div className="participation-section">

      {/* Header */}
      <motion.div
        className="participation-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="participation-header-left">
          <h2>🎯 My Participation History</h2>
          <p>Your journey across clubs, events, and activities</p>
        </div>
        <div className="participation-count-pill">
          {studentParticipations.length} Record{studentParticipations.length !== 1 ? 's' : ''}
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        className="timeline-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {studentParticipations.map((participation, index) => {
          const category = getCategoryDetails(participation.activityCategory);
          const skills = Array.isArray(participation.skills)
            ? participation.skills
            : (participation.skills || '').split(',').map(s => s.trim()).filter(Boolean);

          return (
            <motion.div
              key={participation.id || index}
              className="timeline-item"
              variants={itemVariants}
              whileHover={{ x: 6, transition: { duration: 0.2 } }}
            >
              {/* Timeline Line & Dot */}
              <div className="timeline-left">
                <div
                  className="timeline-dot"
                  style={{
                    background: category.color,
                    boxShadow: `0 0 12px ${category.color}88`
                  }}
                >
                  <span>{category.icon}</span>
                </div>
                {index < studentParticipations.length - 1 && (
                  <div className="timeline-line" />
                )}
              </div>

              {/* Card */}
              <motion.div
                className="timeline-card"
                style={{ borderLeft: `3px solid ${category.color}` }}
                whileHover={{
                  boxShadow: `0 8px 30px ${category.color}30`,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Card Top */}
                <div className="timeline-card-top">
                  <div>
                    <h3 className="timeline-activity-name">{participation.activityName}</h3>
                    <div
                      className="timeline-category-tag"
                      style={{
                        background: `${category.color}18`,
                        border: `1px solid ${category.color}55`,
                        color: category.color
                      }}
                    >
                      {category.icon} {category.name}
                    </div>
                  </div>
                  <div className="timeline-role-badge">
                    {participation.role}
                  </div>
                </div>

                {/* Card Meta */}
                <div className="timeline-meta">
                  <div className="timeline-meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span>{participation.duration}</span>
                  </div>
                  <div className="timeline-meta-item">
                    <span className="meta-icon">📅</span>
                    <span>
                      {participation.startDate
                        ? new Date(participation.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'N/A'}
                      {' → '}
                      {participation.endDate
                        ? new Date(participation.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="timeline-skills">
                    <span className="skills-label">Skills Gained:</span>
                    <div className="skills-list">
                      {skills.map((skill, i) => (
                        <motion.span
                          key={i}
                          className="skill-chip"
                          style={{
                            background: `${category.color}15`,
                            border: `1px solid ${category.color}40`,
                            color: category.color
                          }}
                          whileHover={{ scale: 1.08 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ParticipationTimeline;
