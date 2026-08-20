import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiList, FiPlusSquare, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-logo">
            Admin<span>Portal</span>
          </Link>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <FiX />
          </button>
        </div>

        <nav className="admin-nav">
          <ul>
            <li>
              <Link 
                to="/admin/dashboard" 
                className={`admin-nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <FiHome /> Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/properties" 
                className={`admin-nav-link ${location.pathname === '/admin/properties' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <FiList /> Properties
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/properties/create" 
                className={`admin-nav-link ${location.pathname === '/admin/properties/create' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <FiPlusSquare /> Add Property
              </Link>
            </li>
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-link logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <div className="header-right">
            <span className="admin-badge">Admin Mode</span>
            <Link to="/" className="btn btn-outline btn-sm">View Site</Link>
          </div>
        </header>
        
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
