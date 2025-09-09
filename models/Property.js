// models/Property.js
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  availability: { type: String, required: true }, // Removed enum
  furnishing: { 
    type: [String], 
    required: true // Removed enum
  },
  propertyType: {
    type: String,
    required: true // Removed enum
  },
  price: { type: Number, required: true },
  rentPeriod: { type: String, required: true },
  status: { type: String, required: true },
  amenities: [String],
  images: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);