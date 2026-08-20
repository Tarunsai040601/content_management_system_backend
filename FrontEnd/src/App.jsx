import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "./Pages/Register/Register.jsx";
import Login from "./Pages/Login/Login.jsx";

import AdminLayout from "./Layouts/AdminLayout.jsx";
import CustomerLayout from "./Layouts/CustomerLayout.jsx";


const App = () => {
  return (
    <Routes>
      {/* =========================
          AUTH PAGES
      ========================= */}

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =========================
          ADMIN LAYOUT
      ========================= */}

      <Route path="/admin-dashboard" element={<AdminLayout />}>
        {/* /admin-dashboard */}
        {/* <Route index element={<AdminDashboard />} /> */}

        {/* /admin-dashboard/add-details */}
        {/* <Route path="add-details" element={<AddDetails />} /> */}
      </Route>

      {/* =========================
          CUSTOMER LAYOUT
      ========================= */}

      <Route path="/customer-dashboard" element={<CustomerLayout />}>
        {/* /customer-dashboard */}
        {/* <Route index element={<CustomerDashboard />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
