const Property = require("../Models/PropertySchema.js");
const cloudinary = require("../Configurations/CloudinaryConfig.js");

// Create Property
const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      propertyType,
      price,
      city,
      location,
      fullAddress,
      bedrooms,
      bathrooms,
      area,
      description,
      amenities,
    } = req.body;

    // Required field validation
    if (
      !propertyName ||
      !propertyType ||
      !price ||
      !city ||
      !location ||
      !fullAddress ||
      !bedrooms ||
      !bathrooms ||
      !area ||
      !description
    ) {
      return res.status(400).json({
        message: "All required fields are required",
      });
    }

    // Check duplicate property
    const existingProperty = await Property.findOne({ propertyName });

    if (existingProperty) {
      return res.status(409).json({
        message: "Property already exists",
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "real-estate-properties",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(file.buffer);
        });

        imageUrls.push(result.secure_url);
      }
    }

    const property = await Property.create({
      propertyName,
      propertyType,
      price,
      city,
      location,
      fullAddress,
      bedrooms,
      bathrooms,
      area,
      description,
      amenities: Array.isArray(amenities)
        ? amenities
        : amenities
          ? amenities.split(",").map((item) => item.trim())
          : [],
      images: imageUrls,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create property",
      error: error.message,
    });
  }
};

// Admin - Get Only Properties Created By Logged In Admin
const getAdminProperties = async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Admin properties fetched successfully",
      count: properties.length,
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch admin properties",
      error: error.message,
    });
  }
};

// Public - Get All Properties
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Properties fetched successfully",
      count: properties.length,
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

// Get Property By Name
const getPropertyByName = async (req, res) => {
  try {
    const { propertyName } = req.params;

    const property = await Property.findOne({ propertyName, createdBy: req.user.userId });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    return res.status(200).json({
      message: "Property fetched successfully",
      property,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch property",
      error: error.message,
    });
  }
};

// Update Property By Name
const updateProperty = async (req, res) => {
  try {
    const { propertyName } = req.params;

    const property = await Property.findOne({ propertyName, createdBy: req.user.userId });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const {
      propertyType,
      price,
      city,
      location,
      fullAddress,
      bedrooms,
      bathrooms,
      area,
      description,
      amenities,
    } = req.body;

    // Update normal fields
    property.propertyType = propertyType || property.propertyType;
    property.price = price || property.price;
    property.city = city || property.city;
    property.location = location || property.location;
    property.fullAddress = fullAddress || property.fullAddress;
    property.bedrooms = bedrooms || property.bedrooms;
    property.bathrooms = bathrooms || property.bathrooms;
    property.area = area || property.area;
    property.description = description || property.description;

    if (amenities) {
      property.amenities = Array.isArray(amenities)
        ? amenities
        : amenities.split(",").map((item) => item.trim());
    }

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      const newImageUrls = [];

      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "real-estate-properties",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(file.buffer);
        });

        newImageUrls.push(result.secure_url);
      }

      property.images = newImageUrls;
    }

    await property.save();

    return res.status(200).json({
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update property",
      error: error.message,
    });
  }
};

// Delete Property By Name
const deleteProperty = async (req, res) => {
  try {
    const { propertyName } = req.params;

    const property = await Property.findOneAndDelete({
      propertyName,
      createdBy: req.user.userId,
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    return res.status(200).json({
      message: "Property deleted successfully",
      property,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete property",
      error: error.message,
    });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getAdminProperties,
  getPropertyByName,
  updateProperty,
  deleteProperty,
};
