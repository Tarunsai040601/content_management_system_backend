import React, { createContext, useContext, useState, useEffect } from "react";
// Actually, jwt-decode isn't strictly necessary if we just check token existence, but it's good for getting user info.
// Given I didn't install jwt-decode, I'll just check if the token exists for now.
// Let me change approach to not strictly require jwt-decode unless needed.

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [customerToken, setCustomerToken] = useState(localStorage.getItem("customerToken") || null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || null);

  const loginCustomer = (token) => {
    localStorage.setItem("customerToken", token);
    setCustomerToken(token);
  };

  const logoutCustomer = () => {
    localStorage.removeItem("customerToken");
    setCustomerToken(null);
  };

  const loginAdmin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customerToken,
        adminToken,
        loginCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
        isCustomerAuth: !!customerToken,
        isAdminAuth: !!adminToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
