import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "./Pages/Register/Register.jsx";
import Login from "./Pages/Login/Login.jsx";

import AdminLayout from "./Layouts/AdminLayout.jsx";
import CustomerLayout from "./Layouts/CustomerLayout.jsx";
import AdminHome from "./Components/DashBoards/AdminDashBoard/AdminHome/AdminHome.jsx";
import AddDetails from "./Components/DashBoards/AdminDashBoard/AddDetails/AddDetails.jsx";
import AdminShowDeatails from "./Components/DashBoards/AdminDashBoard/AdminShowDetails/AdminShowDeatails.jsx";
import Property from "./Components/DashBoards/CustomerDashBoard/ShowProperty/Property.jsx";
import Favorites from "./Components/DashBoards/CustomerDashBoard/Favorites/Favorites.jsx";
import About from "./Components/DashBoards/CustomerDashBoard/About/About.jsx";
import Contact from "./Components/DashBoards/CustomerDashBoard/Contact/Contact.jsx";

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

      <Route path="/admin-home" element={<AdminLayout />}>
        {/* /admin-home */}
        <Route index element={<AdminHome/>} />
        <Route path="add-details" element={<AddDetails/>}/>
        <Route path="show-details" element={<AdminShowDeatails/>}/>
      </Route>

      {/* =========================
          CUSTOMER LAYOUT
      ========================= */}

      <Route path="/customer-dashboard" element={<CustomerLayout />}>
        <Route index element={<Property/>} />
        <Route path="properties" element={<Property/>} />
        <Route path="favorites" element={<Favorites/>} />
        <Route path="about" element={<About/>} />
        <Route path="contact" element={<Contact/>} />
      </Route>
    </Routes>
  );
};

export default App;
