const User = require("../models/User");
const Museum = require("../models/Museum");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create new museum
// @route   POST /api/museums
// @access  Private
exports.createMuseum = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const museum = await Museum.create(req.body);

  res.status(200).json({ success: true, data: museum });
});
