import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // ================================
  // MOBILE MENU TOGGLE
  // ================================

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // ================================
  // CLOSE MENU
  // ================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Logout?",
      text: "Are you sure you want to logout from Admin Dashboard?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#263c33",
      cancelButtonColor: "#888",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // Remove ONLY admin authentication
      localStorage.removeItem("adminToken");

      // Remove role
      localStorage.removeItem("userRole");

      // Close mobile menu
      setMenuOpen(false);

      await Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "Admin logged out successfully.",
        timer: 1300,
        showConfirmButton: false,
      });

      navigate("/login");
    }
  };

  return (
    <nav className="admin-navbar">

      {/* =================================
          BRAND
      ================================= */}

      <div className="admin-navbar-brand">

        <h1>ESTORA</h1>

        <span>Admin Dashboard</span>

      </div>

      {/* =================================
          DESKTOP / MOBILE MENU
      ================================= */}

      <div
        className={`admin-navbar-links ${
          menuOpen ? "admin-menu-open" : ""
        }`}
      >

        <Link
          to="/admin-dashboard"
          onClick={closeMenu}
        >
          Home
        </Link>

        <Link
          to="/admin-dashboard/add-details"
          onClick={closeMenu}
        >
          Add Details
        </Link>
        <Link
          to="/admin-dashboard/show-details"
          onClick={closeMenu}
        >
          ShowDetails
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="admin-logout-btn"
        >
          Logout
        </button>

      </div>

      {/* =================================
          MOBILE TOGGLE
      ================================= */}

      <button
        type="button"
        className={`admin-menu-toggle ${
          menuOpen ? "toggle-active" : ""
        }`}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </nav>
  );
};

export default AdminNavbar;