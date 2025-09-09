const express = require('express');
const router = express.Router();
const {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  createPropertyType,
  getPropertyTypes,
  updatePropertyType,
  deletePropertyType,
  createOccupancyType,
  getOccupancyTypes,
  updateOccupancyType,
  deleteOccupancyType
} = require('../controllers/filterController');
const { protect } = require('../middleware/auth');

// Location routes
router.route('/locations')
  .post(protect,  createLocation)
  .get(getLocations);

router.route('/locations/:id')
  .put(protect,  updateLocation)
  .delete(protect,  deleteLocation);

// Property Type routes
router.route('/property-types')
  .post(protect, createPropertyType)
  .get(getPropertyTypes);

router.route('/property-types/:id')
  .put(protect,  updatePropertyType)
  .delete(protect,  deletePropertyType);

// Occupancy Type routes
router.route('/occupancy-types')
  .post(protect,  createOccupancyType)
  .get(getOccupancyTypes);

router.route('/occupancy-types/:id')
  .put(protect,  updateOccupancyType)
  .delete(protect,  deleteOccupancyType);

module.exports = router;