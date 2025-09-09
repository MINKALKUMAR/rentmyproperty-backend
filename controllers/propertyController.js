const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');
const { cloudinary } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');

// Admin Login
const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }
  
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  
  const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
  
  res.status(200).json({ success: true, token });
};

// Upload image to Cloudinary
const uploadImage = async (file) => {
  try {
    if (!file || !file.mimetype) {
      throw new Error('Invalid file format');
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm'];
    
    if (!allowedImageTypes.includes(file.mimetype) && !allowedVideoTypes.includes(file.mimetype)) {
      throw new Error(`Unsupported file format: ${file.mimetype}`);
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'rentmyproperty',
      use_filename: true,
      unique_filename: false,
      resource_type: 'auto'
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      isPrimary: false,
      type: result.resource_type === 'video' ? 'video' : 'image'
    };
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw new Error('Failed to upload media');
  }
};

// Create Property
const createProperty = async (req, res, next) => {
  try {
    const requiredFields = [
      'pid', 'title', 'location', 'type', 'availability',
      'furnishing', 'propertyType', 'price'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(new ErrorResponse(
        `Missing required fields: ${missingFields.join(', ')}`, 
        400
      ));
    }

    let { furnishing, ...rest } = req.body;

    // ✅ Convert furnishing to array if it's a string
    if (typeof furnishing === 'string') {
      try {
        furnishing = JSON.parse(furnishing); // If it's a JSON string
      } catch {
        furnishing = furnishing.split(',').map(item => item.trim());
      }
    }

    const propertyData = {
      ...rest,
      furnishing,
      price: Number(req.body.price),
      amenities: req.body.amenities ? JSON.parse(req.body.amenities) : []
    };

    if (req.files?.length) {
      propertyData.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
        type: file.mimetype.startsWith('image') ? 'image' : 'video'
      }));
    }

    const property = new Property(propertyData);
    await property.save();
    
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    console.error('Creation error:', err);
    next(new ErrorResponse(`Failed to create property: ${err.message}`, 500));
  }
};

// Update Property
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return next(new ErrorResponse('Property not found', 404));
    }

    const updates = req.body;
    
    // ✅ Handle furnishing
    if (updates.furnishing) {
      if (typeof updates.furnishing === 'string') {
        try {
          updates.furnishing = JSON.parse(updates.furnishing);
        } catch {
          updates.furnishing = updates.furnishing.split(',').map(item => item.trim());
        }
      }
    }

    if (updates.amenities) {
      updates.amenities = JSON.parse(updates.amenities);
    }

    if (updates.price) {
      updates.price = Number(updates.price);
    }

    if (req.files?.length) {
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
        type: file.mimetype.startsWith('image') ? 'image' : 'video'
      }));
      updates.images = [...property.images, ...newImages];
    }

    Object.assign(property, updates);
    await property.save();

    res.status(200).json({ success: true, data: property });
  } catch (err) {
    console.error('Update error:', err);
    next(new ErrorResponse(`Failed to update property: ${err.message}`, 500));
  }
};

// Delete Property
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(new ErrorResponse('Property not found', 404));
    }

    await Promise.all(
      property.images.map(image => 
        cloudinary.uploader.destroy(image.public_id).catch(console.error)
      )
    );

    await Property.deleteOne({ _id: req.params.id });
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// Get Properties
const getProperties = async (req, res, next) => {
  try {
    if (req.params.id) {
      const property = await Property.findById(req.params.id);
      if (!property) return next(new ErrorResponse('Property not found', 404));
      return res.status(200).json({ success: true, data: property });
    }

    const filter = {};
    
    if (req.query.location) filter.location = req.query.location;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.availability) filter.availability = req.query.availability;

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: properties.length, 
      data: properties 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  adminLogin,
  createProperty,
  updateProperty,
  getProperties,
  deleteProperty
};
