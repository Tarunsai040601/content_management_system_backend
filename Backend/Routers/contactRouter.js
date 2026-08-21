const express = require("express");
const contactRouter = express.Router();

const authMiddleware = require("../Middlewares/AuthMiddleware.js");
const roleMiddleware = require("../Middlewares/RoleMiddleware.js");

const {
  submitContact,
  getContacts,
} = require("../Controllers/ContactController.js");

// Public - Submit Contact Form
contactRouter.post("/contact", submitContact);

// Admin - Get All Contacts
contactRouter.get(
  "/contacts",
  authMiddleware,
  roleMiddleware("admin"),
  getContacts
);

module.exports = contactRouter;
