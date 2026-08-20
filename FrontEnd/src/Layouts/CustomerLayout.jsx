import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import CustomerNavbar from "../Components/DashBoards/CustomerDashBoard/CustomerNavbar/CustomerNavbar.jsx";
import "./CustomerLayout.css";

const CustomerLayout = () => {
  const customerToken = localStorage.getItem("customerToken");

  if (!customerToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="customer-layout">
      <CustomerNavbar />

      <main className="customer-layout-content">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
