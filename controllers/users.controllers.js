const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");

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

// @desc    Get current logged in user
// @route   GET /api/users/current
// @access  Private
exports.current = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
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

// @desc    Change user password
// @route   POST /api/users/change_password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse("Incorrect password", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Recover user password
// @route   POST /api/users/recover_password
// @access  Public
exports.recoverPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("Email is not registered", 401));
  }

  const { resetPasswordToken, expirePasswordToken } =
    getResetPasswordToken(email);
  user.resetPasswordToken = resetPasswordToken;
  user.expirePasswordToken = expirePasswordToken;

  await user.updateOne({ resetPasswordToken, expirePasswordToken });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/recover_password/${resetPasswordToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
                  Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: "Password reset token",
    //   message,
    // });
    // console.log(message);

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.expirePasswordToken = undefined;

    await user.updateOne({ resetPasswordToken, expirePasswordToken });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Reset user password
// @route   PUT /api/users/recover_password/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  if (!resetToken) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  const resetPasswordToken = resetToken;
  const user = await User.findOne({ resetPasswordToken });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  if (user.expirePasswordToken < Date.now()) {
    return next(new ErrorResponse("Token has expired", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.expirePasswordToken = undefined;
  user.resetPasswordDate = Date.now();

  await user.save();

  res.status(201).json({
    success: true,
    data: "Password reset success",
  });
});

// Get reset password token
const getResetPasswordToken = function (email) {
  // Generate token
  const resetToken = email + crypto.randomBytes(20).toString("hex");

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
    .toString();

  // Set expire
  const expirePasswordToken = Date.now() + 10 * 60 * 1000; // 10 minutes

  return { resetPasswordToken, expirePasswordToken };
};

// @desc    Update user details
// @route   PUT /api/users/change_profile
// @access  Private
exports.changeProfile = asyncHandler(async (req, res, next) => {
  const content = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, content, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
