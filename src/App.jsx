import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Navbar from './components/layout/Navbar';

import { useAppContext } from './context/AppContext';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        {/* ✅ Backend connectivity status banner */}
        <BackendStatusBanner />
        <main style={{ paddingTop: '39px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

// ✅ Shows a non-blocking warning banner if backend is unreachable
function BackendStatusBanner() {
  const { dataError, loading } = useAppContext();

  if (loading || !dataError) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      background: 'rgba(239,68,68,0.92)',
      backdropFilter: 'blur(8px)',
      color: '#fff',
      padding: '0.75rem 1.5rem',
      borderRadius: '999px',
      fontSize: '0.85rem',
      fontWeight: 500,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      ⚠️ Backend offline — Start Spring Boot on <strong>&nbsp;port 8080</strong>
    </div>
  );
}

function PrivateRoute({ children, role }) {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser.role || currentUser.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
