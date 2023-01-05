const User = require("../models/User");

const { Types, isValidObjectId } = require("mongoose");
import { Response, Request } from "express";
import asyncHandler from "express-async-handler";

import Museum from "../models/Museum";
import ErrorResponse from "../utils/errorResponse";
import type { IMuseumCoreData, IMuseumResponse } from "../types";
import {
  RequestWithUser,
  GenericRequestWithUser,
} from "../utils/requestWithUser";

// Declare a custom type for the request object

// @desc    Get all museums
// @route   GET /api/museums
// @access  Public
exports.getMuseums = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    const museums: IMuseumResponse[] | null = await Museum.find();

    res.status(200).json({
      success: true,
      count: museums.length,
      data: museums,
    });
  }
);

// @desc    Get single museum by id or slug
// @route   GET /api/museums/:id
// @access  Public
exports.getMuseum = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    const museum: IMuseumResponse | null = await Museum.findOne({
      museumId: req.params.id,
    });

    if (!museum) {
      return next(
        new ErrorResponse(
          `Museum not found with museum id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: museum,
    });
  }
);

// @desc    Create new museum
// @route   POST /api/museums
// @access  Private
exports.createMuseum = asyncHandler(
  async (
    req: GenericRequestWithUser<{}, {}, IMuseumCoreData>,
    res: Response,
    next: any
  ) => {
    // Add user to req.body
    req.body.userId = req.user.id;

    const museum: IMuseumResponse | null = await Museum.create(req.body);

    res.status(200).json({ success: true, data: museum });
  }
);

// @desc    Update museum by id or slug
// @route   PUT /api/museums/:id
// @access  Private
exports.updateMuseum = asyncHandler(
  async (
    req: GenericRequestWithUser<any, {}, IMuseumCoreData>,
    res: Response,
    next: any
  ) => {
    // Find museum by id
    const museum: IMuseumResponse | null = await Museum.findOne({
      museumId: req.params.id.toString(),
    });

    // Check museum existence
    if (!museum) {
      return next(
        new ErrorResponse(`Museum not found with id of ${req.params.id}`, 404)
      );
    }

    // Verify current user is museum owner
    if (museum.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this museum`,
          401
        )
      );
    }

    // Update museum
    const query: IMuseumResponse | null = await Museum.findOneAndUpdate(
      { museumId: museum.museumId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, data: query });
  }
);
