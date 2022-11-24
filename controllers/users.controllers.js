const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

// @desc    Register a user
// @route   POST /api/users/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create(req.body);

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});

user register hay register user 