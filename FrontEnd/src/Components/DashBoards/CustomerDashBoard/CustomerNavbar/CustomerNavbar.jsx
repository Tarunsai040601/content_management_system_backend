import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./CustomerNavbar.css";

const CustomerNavbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("customerUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCustomerName(user.name || "");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // =========================
  // TOGGLE MENU
  // =========================

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // =========================
  // CLOSE MENU
  // =========================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#263c33",
      cancelButtonColor: "#888",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // Customer token ONLY
      localStorage.removeItem("customerToken");

      // Customer role
      localStorage.removeItem("userRole");

      // Customer details
      localStorage.removeItem("customerUser");

      // Close mobile menu
      setMenuOpen(false);

      await Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        timer: 1300,
        showConfirmButton: false,
      });

      navigate("/login");
    }
  };

  return (
    <nav className="customer-navbar">

      {/* =================================
          BRAND
      ================================= */}

      <Link
        to="/customer-dashboard"
        className="customer-navbar-brand"
        onClick={closeMenu}
      >
        <span className="customer-brand-icon">⌂</span>

        <div className="customer-brand-text">
          <h1>ESTORA</h1>
          <span>REAL ESTATE</span>
        </div>
      </Link>


      {/* =================================
          NAVIGATION
      ================================= */}

      <div
        className={`customer-navbar-links ${
          menuOpen ? "customer-menu-open" : ""
        }`}
      >

        {/* <Link
          to="/customer-dashboard"
          onClick={closeMenu}
          className="customer-nav-link"
        >
          Home
        </Link> */}

        <Link
          to="/customer-dashboard/properties"
          onClick={closeMenu}
          className="customer-nav-link"
        >
          Properties
        </Link>

        <Link
          to="/customer-dashboard/favorites"
          onClick={closeMenu}
          className="customer-nav-link"
        >
          Favorites
        </Link>

        <Link
          to="/customer-dashboard/about"
          onClick={closeMenu}
          className="customer-nav-link"
        >
          About
        </Link>

        <Link
          to="/customer-dashboard/contact"
          onClick={closeMenu}
          className="customer-nav-link"
        >
          Contact
        </Link>

        {customerName && (
          <span style={{ color: "#34483f", margin: "0 10px", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center" }}>
            Welcome: {customerName}
          </span>
        )}

        {/* Logout */}

        <button
          type="button"
          className="customer-logout-btn"
          onClick={handleLogout}
        >
          <span>Logout</span>
          <span className="customer-logout-arrow">→</span>
        </button>

      </div>


      {/* =================================
          MOBILE MENU BUTTON
      ================================= */}

      <button
        type="button"
        className={`customer-menu-toggle ${
          menuOpen ? "customer-toggle-active" : ""
        }`}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </nav>
  );
};

export default CustomerNavbar;