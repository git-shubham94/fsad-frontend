// ============================================================
// src/api/api.js
// Central API service — all backend calls go through here.
// Base URL: http://localhost:8080
// ============================================================

const BASE_URL = "https://fsad-backend-rgzu.onrender.com";

// ─── Helper: make a fetch call and handle errors uniformly ───
async function request(method, path, body = null) {
  const token = localStorage.getItem("jwt_token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  console.log(`[API] ${method} ${BASE_URL}${path}`, body || "");

  const res = await fetch(`${BASE_URL}${path}`, options);

  console.log(`[API] Response ${res.status} for ${method} ${path}`);

  // For empty body responses (e.g. 204 or 403 without body)
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return { ok: res.ok, status: res.status };
  }

  // Parse JSON body (even for error responses)
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ─── STUDENT APIs ────────────────────────────────────────────

/**
 * POST /students/register
 * Register a new student.
 * @param {Object} student - { name, email, password, rollNumber, cohort, department, phone }
 * @returns {Promise<Object>} Saved student object
 */
export const registerStudent = (student) =>
  request("POST", "/students/register", student);

/**
 * POST /students/login
 * Login with email + password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Student object on success
 * @throws Error with status 401 on invalid credentials
 */
export const loginStudent = (email, password) =>
  request("POST", "/students/login", { email, password });

/**
 * GET /students
 * Get all registered students (admin use).
 * @returns {Promise<Array>}
 */
export const getAllStudents = () =>
  request("GET", "/students");

/**
 * GET /students/{id}
 * Get a specific student by ID.
 * @param {number|string} id
 */
export const getStudentById = (id) =>
  request("GET", `/students/${id}`);

/**
 * PUT /students/{id}
 * Update student record.
 * @param {number|string} id
 * @param {Object} studentData
 */
export const updateStudent = (id, studentData) =>
  request("PUT", `/students/${id}`, studentData);

/**
 * DELETE /students/{id}
 * Delete a student and all their achievements + participations.
 * @param {number|string} id
 */
export const deleteStudent = (id) =>
  request("DELETE", `/students/${id}`);

// ─── ACHIEVEMENT APIs ─────────────────────────────────────────

/**
 * GET /achievements
 * Get all achievements.
 * @returns {Promise<Array>}
 */
export const getAllAchievements = () =>
  request("GET", "/achievements");

/**
 * GET /achievements/student/{id}
 * Get achievements for a specific student.
 * @param {number|string} studentId
 * @returns {Promise<Array>}
 */
export const getAchievementsByStudent = (studentId) =>
  request("GET", `/achievements/student/${studentId}`);

/**
 * POST /achievements
 * Add a new achievement.
 * @param {Object} achievement - { title, description, date, studentId }
 * @returns {Promise<Object>} Saved achievement
 */
export const addAchievement = (achievement) =>
  request("POST", "/achievements", achievement);

/**
 * PUT /achievements/{id}
 * Update an achievement by ID.
 * @param {number|string} id
 * @param {Object} achievement
 * @returns {Promise<Object>}
 */
export const updateAchievement = (id, achievement) =>
  request('PUT', `/achievements/${id}`, achievement);

/**
 * DELETE /achievements/{id}
 * Delete an achievement by ID.
 */
export const deleteAchievement = (id) =>
  request('DELETE', `/achievements/${id}`);

// ─── PARTICIPATION APIs ───────────────────────────────────────

/**
 * GET /participations
 * Get all participation records.
 * @returns {Promise<Array>}
 */
export const getAllParticipations = () =>
  request("GET", "/participations");

/**
 * GET /participations/student/{id}
 * Get participations for a specific student.
 * @param {number|string} studentId
 * @returns {Promise<Array>}
 */
export const getParticipationsByStudent = (studentId) =>
  request("GET", `/participations/student/${studentId}`);

/**
 * POST /participations
 * Add a new participation record.
 * @param {Object} participation - { activityName, activityCategory, role, duration, skills, startDate, endDate, studentId }
 * @returns {Promise<Object>} Saved participation
 */
export const addParticipation = (participation) =>
  request("POST", "/participations", participation);

/**
 * PUT /participations/{id}
 * Update a participation record by ID.
 * @param {number|string} id
 * @param {Object} participation
 * @returns {Promise<Object>}
 */
export const updateParticipation = (id, participation) =>
  request('PUT', `/participations/${id}`, participation);

/**
 * DELETE /participations/{id}
 * Delete a participation record by ID.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const deleteParticipation = (id) =>
  request("DELETE", `/participations/${id}`);