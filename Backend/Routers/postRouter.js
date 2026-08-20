const express = require("express");
const Postrouter = express.Router();

const authMiddleware = require("../Middlewares/AuthMiddleware.js");
const roleMiddleware = require("../Middlewares/RoleMiddleware.js");
const upload = require("../Middlewares/MulterMiddleware.js");

const {
  createProperty,
  getProperties,
  getAdminProperties,
  getPropertyByName,
  updateProperty,
  deleteProperty,
} = require("../Controllers/PropertyController.js");

// Admin - Create Property
Postrouter.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin"),
  upload.any(),
  createProperty,
);

// Public - Get All Properties (For Website)
Postrouter.get(
  "/getAll",
  getProperties,
);

// Admin - Get Only Properties Created By Logged In Admin (For Dashboard)
Postrouter.get(
  "/getAdminProperties",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminProperties,
);

// Public - Get Property By Name
Postrouter.get(
  "/get/:propertyName",
  authMiddleware,
  roleMiddleware("admin"),
  getPropertyByName,
);

// Admin - Update Property By Name
Postrouter.put(
  "/update/:propertyName",
  authMiddleware,
  roleMiddleware("admin"),
  upload.any(),
  updateProperty,
);

// Admin - Delete Property By Name
Postrouter.delete(
  "/delete/:propertyName",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProperty,
);

module.exports = Postrouter;
