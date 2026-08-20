import api from "./api";

// Assuming backend AuthRouter maps register/login to /api/registerRouter/...
export const registerCustomer = async (data) => {
  return await api.post("/api/registerRouter/register", data);
};

export const loginCustomer = async (data) => {
  return await api.post("/api/registerRouter/login", data);
};

export const loginAdmin = async (data) => {
  return await api.post("/api/registerRouter/login", data); // Uses same endpoint, role checks happen in frontend
};
