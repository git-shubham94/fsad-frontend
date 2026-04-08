// ============================================================
// src/features/admin/StudentList.jsx
// ✅ REAL DATA: students loaded from backend via AppContext
// Added: loading state, error state, empty state handling
// ============================================================

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './StudentList.css';

const StudentList = () => {
  const { students, achievementList, participationList, loading, dataError, deleteStudent, updateStudent } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [confirmDelete, setConfirmDelete] = useState(null); // holds student to delete
  const [deleting, setDeleting] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState('profile');
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastError, setToastError] = useState('');

  const handleDeleteClick = (student) => setConfirmDelete(student);
  
  const handleEditClick = (student) => {
    setEditFormData(student);
    setEditTab('profile');
    setEditModalOpen(true);
    setToastError('');
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToastError('');
    try {
      const res = await updateStudent(editFormData.id, editFormData);
      if (res.success) {
        setEditModalOpen(false);
        setToastMessage('Student details updated successfully');
        setTimeout(() => setToastMessage(''), 3000);
      } else {
        setToastError(res.error || 'Failed to update student');
      }
    } catch (err) {
      setToastError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteStudent(confirmDelete.id);
      setConfirmDelete(null);
    } catch (err) {
      alert('Failed to delete student: ' + (err.message || 'Server error'));
    } finally {
      setDeleting(false);
    }
  };

  // ─── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="student-list-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
          <p>Loading students from database...</p>
        </div>
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────────
  if (dataError) {
    return (
      <div className="student-list-container">
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px',
          color: '#f87171'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
          <p>{dataError}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
            Make sure the Spring Boot backend is running on http://localhost:8080
          </p>
        </div>
      </div>
    );
  }

  const activeStudents = students.filter(s => s.role !== 'ADMIN');
  
  const filteredStudents = activeStudents.filter(student =>
    (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="student-list-container">
      <div className="list-header">
        <h2>👥 All Students <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>({activeStudents.length} total)</span></h2>
        <input
          type="text"
          placeholder="🔍 Search by name, roll number, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {activeStudents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📭</div>
          <p>No students registered yet.</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Ask students to register via the Register page.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Cohort</th>
                <th>Achievements</th>
                <th>Participations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const achievementCount = achievementList.filter(a => Number(a.studentId) === Number(student.id)).length;
                const participationCount = participationList.filter(p => Number(p.studentId) === Number(student.id)).length;

                return (
                  <tr key={student.id}>
                    <td>{student.rollNumber || '—'}</td>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.email}</td>
                    <td><span className="dept-badge">{student.department || '—'}</span></td>
                    <td>{student.cohort || '—'}</td>
                    <td><span className="count-badge">{achievementCount}</span></td>
                    <td><span className="count-badge">{participationCount}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditClick(student)}
                          style={{
                            background: '#EEEDFE',
                            border: '1px solid #534AB7',
                            color: '#534AB7',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.target.style.background='#534AB7'; e.target.style.color='#EEEDFE'; }}
                          onMouseLeave={e => { e.target.style.background='#EEEDFE'; e.target.style.color='#534AB7'; }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.4)',
                            color: '#f87171',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => e.target.style.background='rgba(239,68,68,0.3)'}
                          onMouseLeave={e => e.target.style.background='rgba(239,68,68,0.15)'}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredStudents.length === 0 && activeStudents.length > 0 && (
        <p className="no-data">No students found matching your search.</p>
      )}

      {/* ── Confirmation Modal ──────────────────────────── */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '16px', padding: '2rem', maxWidth: '420px', width: '90%',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#f87171', marginBottom: '0.75rem', textAlign: 'center' }}>Delete Student?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '0.5rem' }}>
              You are about to permanently delete:
            </p>
            <p style={{ color: 'var(--text-primary)', fontWeight: '700', textAlign: 'center', marginBottom: '0.25rem' }}>
              {confirmDelete.name}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              This will also delete ALL their achievements and participations. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                style={{
                  padding: '10px 24px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '600',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                style={{
                  padding: '10px 24px', borderRadius: '10px',
                  background: 'rgba(239,68,68,0.8)', border: 'none',
                  color: 'white', cursor: deleting ? 'not-allowed' : 'pointer',
                  fontWeight: '700', opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? '⏳ Deleting...' : '🗑️ Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ──────────────────────────── */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px',
          background: '#10b981', color: 'white', padding: '12px 24px',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          ✅ {toastMessage}
        </div>
      )}

      {/* ── Edit Modal ──────────────────────────── */}
      {editModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-light)',
            borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '90%',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Edit Student Details</h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            
            {toastError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {toastError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <button onClick={() => setEditTab('profile')} style={{ background: 'none', border: 'none', color: editTab === 'profile' ? '#534AB7' : 'var(--text-secondary)', fontWeight: editTab === 'profile' ? '600' : '400', borderBottom: editTab === 'profile' ? '2px solid #534AB7' : '1px solid transparent', cursor: 'pointer', paddingBottom: '0.5rem', transition: 'all 0.2s', fontSize: '0.95rem' }}>Student Profile</button>
              <button onClick={() => setEditTab('achievements')} style={{ background: 'none', border: 'none', color: editTab === 'achievements' ? '#534AB7' : 'var(--text-secondary)', fontWeight: editTab === 'achievements' ? '600' : '400', borderBottom: editTab === 'achievements' ? '2px solid #534AB7' : '1px solid transparent', cursor: 'pointer', paddingBottom: '0.5rem', transition: 'all 0.2s', fontSize: '0.95rem' }}>Achievements</button>
              <button onClick={() => setEditTab('participations')} style={{ background: 'none', border: 'none', color: editTab === 'participations' ? '#534AB7' : 'var(--text-secondary)', fontWeight: editTab === 'participations' ? '600' : '400', borderBottom: editTab === 'participations' ? '2px solid #534AB7' : '1px solid transparent', cursor: 'pointer', paddingBottom: '0.5rem', transition: 'all 0.2s', fontSize: '0.95rem' }}>Participations</button>
            </div>

            <div style={{ padding: '0.5rem 0', minHeight: '350px' }}>
              {editTab === 'profile' && (
                <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full Name *</label>
                <input required type="text" name="name" value={editFormData.name || ''} onChange={handleEditChange} className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email *</label>
                <input required type="email" name="email" value={editFormData.email || ''} onChange={handleEditChange} className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Roll Number *</label>
                  <input required type="text" name="rollNumber" value={editFormData.rollNumber || ''} onChange={handleEditChange} className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Department *</label>
                  <select required name="department" value={editFormData.department || ''} onChange={handleEditChange} className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
                    <option value="">Select Dept</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="CSIT">CSIT</option>
                    <option value="AIDS">AIDS</option>
                    <option value="AIML">AIML</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Cohort/Batch Year *</label>
                <input required type="text" name="cohort" value={editFormData.cohort || ''} onChange={handleEditChange} placeholder="e.g., 2021-2025" className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phone</label>
                  <input type="text" name="phone" value={editFormData.phone || ''} onChange={handleEditChange} placeholder="Phone number" className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>New Password (leave blank to keep current)</label>
                <input type="password" name="password" value={editFormData.password || ''} onChange={handleEditChange} placeholder="Enter new password" className="form-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  disabled={saving}
                  style={{
                    padding: '10px 24px', borderRadius: '10px',
                    background: 'transparent', border: '1px solid #534AB7',
                    color: '#534AB7', cursor: 'pointer', fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '10px 24px', borderRadius: '10px',
                    background: '#534AB7', border: 'none',
                    color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
                    fontWeight: '700', opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>

            </form>
            )}

            {editTab === 'achievements' && <StudentAchievementsEditor studentId={editFormData.id} />}
            
            {editTab === 'participations' && <StudentParticipationsEditor studentId={editFormData.id} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentAchievementsEditor = ({ studentId }) => {
  const { achievementList, updateAchievement, deleteAchievement } = useAppContext();
  const achievements = achievementList.filter(a => Number(a.studentId) === Number(studentId));
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const startEdit = (a) => {
    setEditingId(a.id);
    setFormData(a);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAchievement(editingId, formData);
      setEditingId(null);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      await deleteAchievement(id);
    }
  };

  if (achievements.length === 0) return <p style={{color:'var(--text-secondary)'}}>No achievements found for this student.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {achievements.map(a => (
        <div key={a.id} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          {editingId === a.id ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="form-input" placeholder="Title" />
              <textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="form-input" rows="2" placeholder="Description" />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="form-input" style={{flex: 1}}>
                  <option value="award">Award</option>
                  <option value="recognition">Recognition</option>
                  <option value="participation">Participation</option>
                </select>
                <input type="date" value={formData.date ? formData.date.split('T')[0] : ''} onChange={e=>setFormData({...formData, date: e.target.value})} className="form-input" style={{flex: 1}} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={()=>setEditingId(null)} style={{ background: 'transparent', border: '1px solid #534AB7', color: '#534AB7', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ background: '#534AB7', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{a.title}</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startEdit(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }} title="Edit">✏️</button>
                  <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }} title="Delete">🗑️</button>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>{a.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(83,74,183,0.1)', color: '#534AB7', borderRadius: '12px', textTransform: 'capitalize' }}>{a.category}</span>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', borderRadius: '12px' }}>{new Date(a.date).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const StudentParticipationsEditor = ({ studentId }) => {
  const { participationList, updateParticipation, deleteParticipation } = useAppContext();
  const participations = participationList.filter(p => Number(p.studentId) === Number(studentId));
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      ...p,
      skillsInput: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || '')
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, skills: formData.skillsInput.split(',').map(s=>s.trim()) };
      await updateParticipation(editingId, payload);
      setEditingId(null);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this participation?")) {
      await deleteParticipation(id);
    }
  };

  if (participations.length === 0) return <p style={{color:'var(--text-secondary)'}}>No participations found for this student.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {participations.map(p => (
        <div key={p.id} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          {editingId === p.id ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input required type="text" value={formData.activityName} onChange={e=>setFormData({...formData, activityName: e.target.value})} className="form-input" placeholder="Activity Name" />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input required type="text" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="form-input" placeholder="Role (e.g. Member)" style={{flex: 1}} />
                <input type="text" value={formData.duration} onChange={e=>setFormData({...formData, duration: e.target.value})} className="form-input" placeholder="Duration (e.g. 6 mos)" style={{flex: 1}} />
              </div>
              <input required type="text" value={formData.skillsInput} onChange={e=>setFormData({...formData, skillsInput: e.target.value})} className="form-input" placeholder="Skills (comma separated)" />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={()=>setEditingId(null)} style={{ background: 'transparent', border: '1px solid #534AB7', color: '#534AB7', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ background: '#534AB7', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{p.activityName}</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }} title="Edit">✏️</button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }} title="Delete">🗑️</button>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Role: <strong>{p.role}</strong> {p.duration ? `• ${p.duration}` : ''}</p>
              
              {p.skills && p.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                  {(Array.isArray(p.skills) ? p.skills : [p.skills]).map((s, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', borderRadius: '4px' }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentList;
