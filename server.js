// const app = require('./app');
// const connectDB = require('./config/db');

// // Load env vars
// require('dotenv').config();

// // Connect to database
// connectDB();

// const PORT = process.env.PORT || 8000;

// // const server = app.listen(PORT, () => {
// //   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// // });
// const server = app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });



// MUST BE FIRST: Load environment variables
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const PORT = process.env.PORT || 8000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => {
    console.error('Shutting down server due to unhandled promise rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception Error: ${err.message}`);
  console.error('Shutting down server due to uncaught exception');
  process.exit(1);
});