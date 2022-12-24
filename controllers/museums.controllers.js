const User = require("../models/User");
const Museum = require("../models/Museum");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { Types, isValidObjectId } = require("mongoose");

// @desc    Get all museums
// @route   GET /api/museums
// @access  Public
exports.getMuseums = asyncHandler(async (req, res, next) => {
  const museums = await Museum.find();

  res.status(200).json({
    success: true,
    count: museums.length,
    data: museums,
  });
});

const getMuseumByIdOrSlug = async (req) => {
  // get id or slug from params
  const { id } = req.params;

  // check if id is valid ObjectId or slug
  const museum = await Museum.findOne({
    $or: [
      { _id: isValidObjectId(id) ? Types.ObjectId(id) : undefined },
      { slug: id },
    ],
  });

  // check if museum exists
  if (!museum) {
    return next(
      new ErrorResponse(`Museum not found with id of ${req.params.id}`, 404)
    );
  }

  return museum;
};

// @desc    Get single museum by id or slug
// @route   GET /api/museums/:id
// @access  Public
exports.getMuseum = asyncHandler(async (req, res, next) => {
  const museum = await getMuseumByIdOrSlug(req, next);

  res.status(200).json({
    success: true,
    data: museum,
  });
});

// @desc    Create new museum
// @route   POST /api/museums
// @access  Private
exports.createMuseum = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const museum = await Museum.create(req.body);

  res.status(200).json({ success: true, data: museum });
});
