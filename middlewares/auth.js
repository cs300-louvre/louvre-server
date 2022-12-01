const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// verifyToken
exports.verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  } else {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // get user from database and attach to request
  req.user = await User.findById(decodedToken.id);

  next();
});
