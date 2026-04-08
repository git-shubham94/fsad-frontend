// ============================================================
// src/features/admin/AchievementForm.jsx
// ✅ REAL API: POST /achievements via AppContext.addAchievement()
// Added: loading state, error handling, success/failure toasts
// ============================================================

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Button.css';

const AchievementForm = () => {
  const { students, addAchievement, activityCategories } = useAppContext();
  const activeStudents = students.filter(s => s.role !== 'ADMIN');

  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    category: 'award',
    activityCategory: '',
    description: '',
    date: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ REAL API CALL → POST /achievements
      await addAchievement(formData);

      toast.success('🎉 Achievement saved to database!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });

      // Reset form
      setFormData({
        studentId: '',
        title: '',
        category: 'award',
        activityCategory: '',
        description: '',
        date: ''
      });
    } catch (err) {
      console.error('[AchievementForm] Submit error:', err);
      toast.error(`❌ Failed to save achievement: ${err.message || 'Server error'}`, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'colored',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="form-container">
        <h2>➕ Add New Achievement</h2>
        <p className="form-description">
          Record student awards, recognitions, and participations — saved to MySQL
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Student *</label>
            {activeStudents.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                ⏳ Loading students from backend...
              </p>
            ) : (
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Choose a student</option>
                {activeStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber || s.email}) — {s.department || 'N/A'}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Achievement Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., First Prize in Hackathon"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="award">🥇 Award</option>
              <option value="recognition">⭐ Recognition</option>
              <option value="participation">🎯 Participation</option>
            </select>
          </div>

          <div className="form-group">
            <label>Activity Type *</label>
            <select
              name="activityCategory"
              value={formData.activityCategory}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Select Activity Type</option>
              {activityCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the achievement in detail..."
              rows="4"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="custom-btn custom-btn-primary full-width"
            disabled={isLoading || activeStudents.length === 0}
            style={{ opacity: (isLoading || activeStudents.length === 0) ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? '⏳ Saving to Database...' : '✅ Add Achievement'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AchievementForm;
