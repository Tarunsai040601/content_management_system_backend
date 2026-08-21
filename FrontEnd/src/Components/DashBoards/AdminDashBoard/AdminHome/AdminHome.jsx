import React from "react";
import "./AdminHome.css";

const AdminHome = () => {
  return (
    <div className="admin-home-page">
      <div className="admin-home-overlay"></div>

      <div className="admin-home-content">
        <div className="admin-home-glass-card">
          <span className="admin-home-badge">ADMIN PANEL</span>

          <h1>
            Welcome to
            <span> ESTORA</span>
          </h1>

          <p>
            Manage properties, customers and your real-estate platform from your
            admin dashboard.
          </p>

          <div className="admin-home-divider"></div>

          <div className="admin-home-status">
            <span className="admin-status-dot"></span>
            <span>Administrator Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
