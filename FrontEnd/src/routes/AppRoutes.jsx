import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import AdminLayout from '../components/Layout/AdminLayout';

import Home from '../pages/Home/Home';
import Properties from '../pages/Properties/Properties';
import PropertyDetails from '../pages/PropertyDetails/PropertyDetails';
import Favorites from '../pages/Favorites/Favorites';
import RecentlyViewed from '../pages/RecentlyViewed/RecentlyViewed';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AdminLogin from '../pages/Admin/AdminLogin/AdminLogin';
import AdminDashboard from '../pages/Admin/AdminDashboard/AdminDashboard';
import AdminProperties from '../pages/Admin/AdminProperties/AdminProperties';
import CreateProperty from '../pages/Admin/CreateProperty/CreateProperty';
import EditProperty from '../pages/Admin/EditProperty/EditProperty';
import NotFound from '../pages/NotFound/NotFound';

const ProtectedCustomerRoute = ({ children }) => {
  const { isCustomerAuth } = useAuth();
  if (!isCustomerAuth) return <Navigate to="/login" replace />;
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuth } = useAuth();
  if (!isAdminAuth) return <Navigate to="/admin/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="property/:propertyName" element={<PropertyDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Customer Routes (if any specific ones) */}
          <Route path="favorites" element={
            <ProtectedCustomerRoute>
              <Favorites />
            </ProtectedCustomerRoute>
          } />
          <Route path="recently-viewed" element={<RecentlyViewed />} />
        </Route>

        {/* Admin Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="properties/create" element={<CreateProperty />} />
          <Route path="properties/edit/:propertyName" element={<EditProperty />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
