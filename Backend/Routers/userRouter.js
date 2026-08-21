const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../Middlewares/AuthMiddleware.js");

const {
  toggleFavorite,
  getFavorites,
} = require("../Controllers/FavoritesController.js");

// Toggle Favorite (Add/Remove)
userRouter.post(
  "/toggle-favorite/:propertyId",
  authMiddleware,
  toggleFavorite
);

// Get all favorites for the logged-in user
userRouter.get(
  "/favorites",
  authMiddleware,
  getFavorites
);

module.exports = userRouter;
