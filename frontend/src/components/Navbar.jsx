// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate=useNavigate();
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className='left'>
        <ul>
          <li><Link to="/">Prime Video</Link></li>
        </ul>
      </div>
      <div className='right'>
        <ul>
          <li><Link to="/">Watch Movie</Link></li>
          <li><Link to="/plotsearch">Plot Search</Link></li>
          {/* <li><Link to="/searchTimeStamp">caption Search</Link></li> */}
          <li>
            <Link to="/login" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
