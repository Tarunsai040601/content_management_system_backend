const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "Independent House", "Commercial"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    area: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Property", PropertySchema);
