const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const propertyTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const occupancyTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', locationSchema);
const PropertyType = mongoose.model('PropertyType', propertyTypeSchema);
const OccupancyType = mongoose.model('OccupancyType', occupancyTypeSchema);

module.exports = { Location, PropertyType, OccupancyType };