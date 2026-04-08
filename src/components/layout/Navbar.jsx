import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const Navbar = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    ...(currentUser ? [] : [
      { path: '/login', label: 'Login' },
      { path: '/register', label: 'Register' }
    ]),
    ...(currentUser?.role === 'admin' ? [{ path: '/admin', label: 'Dashboard' }] : []),
    ...(currentUser?.role === 'student' ? [{ path: '/student', label: 'Dashboard' }] : []),
  ];


};

export default Navbar;
