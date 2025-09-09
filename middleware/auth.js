// const admin = require('firebase-admin');

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     // Check for token in headers
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         error: 'Not authorized, no token'
//       });
//     }

//     // Verify token
//     try {
//       const decodedToken = await admin.auth().verifyIdToken(token);
//       req.user = decodedToken;
//       next();
//     } catch (error) {
//       console.error('Token verification error:', error);
//       return res.status(401).json({
//         success: false,
//         error: 'Not authorized, token failed'
//       });
//     }
//   } catch (err) {
//     console.error('Authentication error:', err);
//     return res.status(401).json({
//       success: false,
//       error: 'Not authorized'
//     });
//   }
// };

// module.exports = { protect };



const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

// Protect middleware
const protect = (req, res, next) => {
  let token;

  // Check Bearer token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // No token → not authorized
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

module.exports = {protect};