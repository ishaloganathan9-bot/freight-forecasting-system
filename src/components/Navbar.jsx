import React from 'react';
import { Anchor } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <header className="navbar-container">
      {/* Brand Logo & Name */}
      <div 
        className="brand-wrapper" 
        onClick={() => setCurrentPage('home')}
      >
        <div className="brand-icon">
          <Anchor size={20} />
        </div>
        <div>
          <span className="brand-title">Intelligent Freight & Chartering</span>
          <span className="brand-subtitle">Decision Support System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-links">
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage('dashboard')}
          className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
        >
          Market Intelligence
        </button>
      </nav>
    </header>
  );
}