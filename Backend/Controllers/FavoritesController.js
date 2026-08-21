const User = require("../Models/RegisterSchema.js");
const Property = require("../Models/PropertySchema.js");

// Toggle favorite property for the user
const toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isFavorite = user.favorites.includes(propertyId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== propertyId.toString()
      );
    } else {
      // Add to favorites
      user.favorites.push(propertyId);
    }

    await user.save();

    return res.status(200).json({
      message: isFavorite
        ? "Property removed from favorites"
        : "Property added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to toggle favorite",
      error: error.message,
    });
  }
};

// Get user's favorite properties
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Favorites fetched successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
};
