const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Register a user
// @route   POST /api/users/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenInResponse(user, 201, res);
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Email is not registered", 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Wrong password.", 401));
  }

  sendTokenInResponse(user, 200, res);
});

const sendTokenInResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const option = {
    expires: Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    httpOnly: true, // Cookie can't be accessed or modified in any way by the browser
    secure: process.env.NODE_ENV === "production", // Cookie will only be sent on an encrypted connection
  };

  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    token,
  });
};
