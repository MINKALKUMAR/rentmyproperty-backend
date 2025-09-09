const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Route files
const properties = require('./routes/propertyRoutes');
const filters = require('./routes/filterRoute');

const app = express();

// Connect to database
connectDB()

// Middleware
app.use(cors());
// In your backend server setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/api/v1/properties', properties);
app.use('/api/v1/filters', filters);

// Error handling middleware (must be after routes)
app.use(errorHandler);

module.exports = app;








