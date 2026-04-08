// ============================================================
// src/context/AppContext.jsx
// ✅ ALL DATA FROM BACKEND — zero mock data
// ============================================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  getAllStudents,
  getAllAchievements,
  getAllParticipations,
  addAchievement as apiAddAchievement,
  updateAchievement as apiUpdateAchievement,
  deleteAchievement as apiDeleteAchievement,
  addParticipation as apiAddParticipation,
  updateParticipation as apiUpdateParticipation,
  deleteParticipation as apiDeleteParticipation,
  registerStudent as apiRegisterStudent,
  deleteStudent as apiDeleteStudent,
  updateStudent as apiUpdateStudent,
  getStudentById as apiGetStudentById,
} from '../api/api';

const AppContext = createContext();

// ✅ Activity categories = UI metadata only (not stored in DB)
export const activityCategories = [
  { id: 'sports',          name: 'Sports',          icon: '⚽', color: '#10b981' },
  { id: 'cultural',        name: 'Cultural',         icon: '🎭', color: '#f59e0b' },
  { id: 'technical',       name: 'Technical',        icon: '💻', color: '#3b82f6' },
  { id: 'academic',        name: 'Academic',         icon: '📚', color: '#8b5cf6' },
  { id: 'social',          name: 'Social Service',   icon: '🤝', color: '#ec4899' },
  { id: 'leadership',      name: 'Leadership',       icon: '👑', color: '#ef4444' },
  { id: 'entrepreneurship',name: 'Entrepreneurship', icon: '💡', color: '#14b8a6' },
  { id: 'other',           name: 'Other',            icon: '🌟', color: '#6366f1' },
];

export const AppProvider = ({ children }) => {

  // ── Auth ─────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // ── Data from backend ─────────────────────────────────────
  const [students,         setStudents]         = useState([]);
  const [achievementList,  setAchievementList]  = useState([]);
  const [participationList,setParticipationList] = useState([]);

  // ── Status ────────────────────────────────────────────────
  const [loading,   setLoading]   = useState(true);
  const [dataError, setDataError] = useState(null);

  // ── Persist current user ──────────────────────────────────
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('jwt_token'); // Clear token on logout
    }
  }, [currentUser]);

  // ── Load ALL data from backend on mount ───────────────────
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setDataError(null);
    console.log('[AppContext] Fetching data from http://localhost:8080 ...');
    try {
      const [s, a, p] = await Promise.all([
        getAllStudents().catch(e => { if (e.status === 401 || e.status === 403) return []; throw e; }),
        getAllAchievements(),
        getAllParticipations(),
      ]);
      setStudents(s || []);
      setAchievementList(a || []);
      setParticipationList(p || []);
      
      // ✅ Sync currentUser profile directly to reflect any background Admin edits!
      if (currentUser && currentUser.id) {
         try {
             const freshUser = await apiGetStudentById(currentUser.id);
             if (freshUser && freshUser.id) {
                 setCurrentUser(freshUser);
             }
         } catch (userErr) {
             console.error('[AppContext] Failed to refresh current user profile:', userErr);
         }
      }

      console.log('[AppContext] Loaded → students:', s?.length, 'achievements:', a?.length, 'participations:', p?.length);
    } catch (err) {
      console.error('[AppContext] Backend fetch failed:', err);
      if (err.status === 401 || err.status === 403) {
        setStudents([]);
        setAchievementList([]);
        setParticipationList([]);
        setDataError(null); 
      } else {
        setDataError('Cannot reach backend at http://localhost:8080. Start the Spring Boot server.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]); // depend on ID so it refreshes correctly

  useEffect(() => { loadAllData(); }, [loadAllData]);

  // ── DELETE STUDENT (cascade) ──────────────────────────────
  const deleteStudent = async (studentId) => {
    console.log('[deleteStudent] DELETE /students/' + studentId);
    await apiDeleteStudent(studentId);
    // Remove student from state
    setStudents(prev => prev.filter(s => s.id !== studentId));
    // Remove all their achievements and participations from state too
    setAchievementList(prev => prev.filter(a => Number(a.studentId) !== Number(studentId)));
    setParticipationList(prev => prev.filter(p => Number(p.studentId) !== Number(studentId)));
    console.log('[deleteStudent] Removed student ' + studentId + ' and all their data from state');
  };

  // ── REGISTER ──────────────────────────────────────────────
  const registerStudent = async (userData) => {
    console.log('[registerStudent] Calling POST /students/register', userData.email);
    try {
      const saved = await apiRegisterStudent({
        name:       userData.name,
        email:      userData.email,
        password:   userData.password,
        rollNumber: userData.rollNumber,
        cohort:     userData.cohort,
        department: userData.department,
        phone:      userData.phone || '',
      });
      setStudents(prev => [...prev, saved]);
      console.log('[registerStudent] Success:', saved);
      return { success: true, data: saved };
    } catch (err) {
      console.error('[registerStudent] Error:', err);
      if (err.status === 409) return { success: false, error: 'Email already exists!' };
      return { success: false, error: err.message || 'Registration failed. Try again.' };
    }
  };

  // ── UPDATE & GET STUDENT ──────────────────────────────────
  const updateStudent = async (id, updatedData) => {
    try {
      console.log('[updateStudent] PUT /students/' + id, updatedData);
      const saved = await apiUpdateStudent(id, updatedData);
      setStudents(prev => prev.map(s => (Number(s.id) === Number(id) ? saved : s)));
      // Auto-update current active user profile if it's identical
      if (currentUser && Number(currentUser.id) === Number(id)) {
          setCurrentUser(saved);
      }
      return { success: true, data: saved };
    } catch (err) {
      console.error('[updateStudent] Error:', err);
      return { success: false, error: err.message || 'Update failed (duplicate roll/email or server error).' };
    }
  };

  const getStudentById = async (id) => {
      return await apiGetStudentById(id);
  };

  // ── ADD ACHIEVEMENT ───────────────────────────────────────
  const addAchievement = async (achievement) => {
    const payload = {
      title:            achievement.title,
      description:      achievement.description,
      category:         achievement.category,         // ✅ 'award' | 'recognition' | 'participation'
      activityCategory: achievement.activityCategory, // ✅ 'technical' | 'sports' etc.
      date:             achievement.date || null,
      studentId:        parseInt(achievement.studentId),
    };
    console.log('[addAchievement] POST /achievements', payload);
    const saved = await apiAddAchievement(payload);
    setAchievementList(prev => [...prev, saved]);
    return saved;
  };

  const deleteAchievement = async (id) => {
    await apiDeleteAchievement(id);
    setAchievementList(prev => prev.filter(a => a.id !== id));
  };

  const updateAchievement = async (id, updated) => {
    try {
      console.log('[updateAchievement] PUT /achievements/' + id, updated);
      const saved = await apiUpdateAchievement(id, updated);
      setAchievementList(prev => prev.map(a => a.id === id ? saved : a));
      return saved;
    } catch (err) {
      console.error('[updateAchievement] Error:', err);
      // Fall back to local update if backend fails
      setAchievementList(prev => prev.map(a => a.id === id ? { ...updated, id } : a));
      throw err;
    }
  };

  // ── ADD PARTICIPATION ─────────────────────────────────────
  const addParticipation = async (participation) => {
    const payload = {
      activityName:     participation.activityName,
      activityCategory: participation.activityCategory,
      role:             participation.role,
      duration:         participation.duration,
      skills: Array.isArray(participation.skills)
        ? participation.skills.join(',')
        : participation.skills,
      startDate:  participation.startDate || null,
      endDate:    participation.endDate   || null,
      studentId:  parseInt(participation.studentId),
    };
    console.log('[addParticipation] POST /participations', payload);
    const saved = await apiAddParticipation(payload);
    const normalized = {
      ...saved,
      skills: saved.skills ? saved.skills.split(',').map(s => s.trim()) : [],
    };
    setParticipationList(prev => [...prev, normalized]);
    return normalized;
  };

  const deleteParticipation = async (id) => {
    await apiDeleteParticipation(id);
    setParticipationList(prev => prev.filter(p => p.id !== id));
  };

  const updateParticipation = async (id, updated) => {
    try {
      const payload = {
        ...updated,
        skills: Array.isArray(updated.skills)
          ? updated.skills.join(',')
          : updated.skills,
      };
      console.log('[updateParticipation] PUT /participations/' + id, payload);
      const saved = await apiUpdateParticipation(id, payload);
      const normalized = {
        ...saved,
        skills: saved.skills ? saved.skills.split(',').map(s => s.trim()) : [],
      };
      setParticipationList(prev => prev.map(p => p.id === id ? normalized : p));
      return normalized;
    } catch (err) {
      console.error('[updateParticipation] Error:', err);
      // Fall back to local update if backend fails
      setParticipationList(prev => prev.map(p => p.id === id ? { ...updated, id } : p));
      throw err;
    }
  };

  // ── Context value ─────────────────────────────────────────
  const value = {
    currentUser, setCurrentUser,
    students, achievementList, participationList,
    activityCategories,
    loading, dataError,
    refreshData: loadAllData,
    registerStudent,
    deleteStudent, updateStudent, getStudentById,
    addAchievement, updateAchievement, deleteAchievement,
    addParticipation, updateParticipation, deleteParticipation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};