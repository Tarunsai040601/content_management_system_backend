import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from '../Components/DashBoards/AdminDashBoard/AdminNavbar/AdminNavbar.jsx'
import Footer from '../Components/Footer/Footer.jsx';
import "./AdminLayout.css";

const AdminLayout = () => {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      {/* <AdminSidebar /> */}
      <AdminNavbar/>
      <div className="admin-main-wrapper">
        {/* <AdminHeader /> */}
        <main className="admin-main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
