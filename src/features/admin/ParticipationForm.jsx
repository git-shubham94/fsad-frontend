// ============================================================
// src/features/admin/ParticipationForm.jsx
// ✅ REAL API: POST /participations via AppContext.addParticipation()
// Added: loading state, error handling, success/failure toasts
// ============================================================

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ParticipationForm = () => {
  const { students, addParticipation, activityCategories } = useAppContext();
  const activeStudents = students.filter(s => s.role !== 'ADMIN');

  const [formData, setFormData] = useState({
    studentId: '',
    activityName: '',
    activityCategory: '',
    role: '',
    duration: '',
    skills: '',
    startDate: '',
    endDate: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse skills from comma-separated string to array
      const participationData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      };

      // ✅ REAL API CALL → POST /participations
      await addParticipation(participationData);

      toast.success('🎉 Participation saved to database!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });

      // Reset form
      setFormData({
        studentId: '',
        activityName: '',
        activityCategory: '',
        role: '',
        duration: '',
        skills: '',
        startDate: '',
        endDate: ''
      });
    } catch (err) {
      console.error('[ParticipationForm] Submit error:', err);
      toast.error(`❌ Failed to save participation: ${err.message || 'Server error'}`, {
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
        <h2>➕ Add Participation Record</h2>
        <p className="form-description">
          Record student club activities and event participations — saved to MySQL
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
            <label>Activity Name *</label>
            <input
              type="text"
              name="activityName"
              value={formData.activityName}
              onChange={handleChange}
              placeholder="e.g., Coding Club, Football Team"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Activity Category *</label>
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
            <label>Role / Position *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., President, Member, Captain"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 1 year, 6 months"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Skills Gained *</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., Leadership, Teamwork, Communication"
              required
              disabled={isLoading}
            />
            <small style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Separate multiple skills with commas
            </small>
          </div>

          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
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
            {isLoading ? '⏳ Saving to Database...' : '✅ Add Participation'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ParticipationForm;
