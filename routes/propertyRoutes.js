const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { storage } = require('../config/cloudinary');
const {
  adminLogin,
  createProperty,
  updateProperty,
  deleteProperty,
  getProperties
} = require('../controllers/propertyController');

const upload = multer({ storage });



// Public routes
router.post('/admin/login', adminLogin);
router.get('/', getProperties);
router.get('/:id', getProperties);

// Protected routes
router.post('/', protect, upload.array('images', 50), createProperty);
router.put('/:id', protect, upload.array('images', 50), updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;