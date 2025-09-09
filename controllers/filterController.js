const { Location, PropertyType, OccupancyType } = require('../models/Filter');
const { ErrorResponse } = require('../utils/errorResponse');

// Common CRUD operations
const createItem = async (Model, req, res, next) => {
  try {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const getItems = async (Model, req, res, next) => {
  try {
    const items = await Model.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

const updateItem = async (Model, req, res, next) => {
  try {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (Model, req, res, next) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);

    if (!item) {
      return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// Location Controllers
exports.createLocation = (req, res, next) => createItem(Location, req, res, next);
exports.getLocations = (req, res, next) => getItems(Location, req, res, next);
exports.updateLocation = (req, res, next) => updateItem(Location, req, res, next);
exports.deleteLocation = (req, res, next) => deleteItem(Location, req, res, next);

// Property Type Controllers
exports.createPropertyType = (req, res, next) => createItem(PropertyType, req, res, next);
exports.getPropertyTypes = (req, res, next) => getItems(PropertyType, req, res, next);
exports.updatePropertyType = (req, res, next) => updateItem(PropertyType, req, res, next);
exports.deletePropertyType = (req, res, next) => deleteItem(PropertyType, req, res, next);

// Occupancy Type Controllers
exports.createOccupancyType = (req, res, next) => createItem(OccupancyType, req, res, next);
exports.getOccupancyTypes = (req, res, next) => getItems(OccupancyType, req, res, next);
exports.updateOccupancyType = (req, res, next) => updateItem(OccupancyType, req, res, next);
exports.deleteOccupancyType = (req, res, next) => deleteItem(OccupancyType, req, res, next);