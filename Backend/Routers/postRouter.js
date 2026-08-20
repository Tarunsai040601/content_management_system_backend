const express = require("express");
const Postrouter = express.Router();

const authMiddleware = require("../Middlewares/AuthMiddleware.js");
const roleMiddleware = require("../Middlewares/RoleMiddleware.js");
const upload = require("../Middlewares/MulterMiddleware.js");

const {
  createProperty,
  getProperties,
  getPropertyByName,
  updateProperty,
  deleteProperty,
} = require("../Controllers/PropertyController");

// Admin - Create Property
Postrouter.post(
  "/create",
  authMiddleware,
  roleMiddleware("Admin"),
  upload.array("images", 5),
  createProperty,
);

// Public - Get All Properties
Postrouter.get(
  "/getAll",
  authMiddleware,
  roleMiddleware("Admin"),
  getProperties,
);

// Public - Get Property By Name
Postrouter.get(
  "/get/:propertyName",
  authMiddleware,
  roleMiddleware("Admin"),
  getPropertyByName,
);

// Admin - Update Property By Name
Postrouter.put(
  "/update/:propertyName",
  authMiddleware,
  roleMiddleware("Admin"),
  upload.array("images", 5),
  updateProperty,
);

// Admin - Delete Property By Name
Postrouter.delete(
  "/delete/:propertyName",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteProperty,
);

module.exports = Postrouter;
