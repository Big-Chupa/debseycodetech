import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check authentication, role, AND the user's name!
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName'); // Grabbing the name we just saved

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName'); // Clear the name on logout
    setIsOpen(false); 
    navigate('/login'); 
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="global-navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>DebseyCodeTech</Link>
      </div>
      
      {/* HAMBURGER ICON FOR MOBILE */}
      <div className={`hamburger ${isOpen ? 'toggle' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>

      {/* NAVIGATION LINKS */}
      <ul className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="/catalogue" onClick={closeMenu}>Catalogue</Link>
        </li>
        
        {/* Only show "My Learning" if they are logged in */}
        {token && (
          <li>
            <Link to="/mylearning" onClick={closeMenu}>My Learning</Link>
          </li>
        )}
        
        {role === 'admin' && (
          <li>
            <Link to="/admin" className="admin-link" onClick={closeMenu}>Command Center</Link>
          </li>
        )}

        {/* --- THE NEW DYNAMIC LOGIN/LOGOUT SECTION --- */}
        {token ? (
          <li className="user-greeting-wrapper">
            {/* If they are logged in, we say Welcome! */}
            <span className="welcome-text">Welcome, {userName || 'Student'}</span>
            <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li>
            <Link to="/login" className="nav-btn login-btn" onClick={closeMenu}>Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;