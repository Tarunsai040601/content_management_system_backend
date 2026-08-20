import api, { adminApi, customerApi } from "./api";

// Public route to get all properties
export const getAllProperties = async () => {
  return await api.get("/api/getAll");
};

// Getting a single property details
// Note: Backend has admin role middleware on this, we'll try with customer token if available
export const getPropertyByName = async (propertyName) => {
  // If user is logged in as admin, it will use adminApi
  if (localStorage.getItem("adminToken")) {
    return await adminApi.get(`/api/get/${propertyName}`);
  }
  // Otherwise use customerApi, though backend might block it due to roleMiddleware("admin")
  return await customerApi.get(`/api/get/${propertyName}`);
};

// Admin route to get their properties
export const getAdminProperties = async () => {
  return await adminApi.get("/api/getAdminProperties");
};

// Admin route to create property
export const createProperty = async (formData) => {
  return await adminApi.post("/api/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Admin route to update property
export const updateProperty = async (propertyName, formData) => {
  return await adminApi.put(`/api/update/${propertyName}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Admin route to delete property
export const deleteProperty = async (propertyName) => {
  return await adminApi.delete(`/api/delete/${propertyName}`);
};
