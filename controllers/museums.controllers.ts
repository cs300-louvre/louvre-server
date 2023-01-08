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
// @route   GET /museum
// @access  Public
exports.getMuseums = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    let museums: IMuseumResponse[] | null;

    if (req.query.genre) {
      museums = await Museum.find({
        genre: { $regex: req.query.genre, $options: "i" },
      });
    } else {
      museums = await Museum.find();
    }

    // sort by createdAt
    museums.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json(museums);
  }
);

// @desc    Get single museum by id or slug
// @route   GET /museum/:id
// @access  Public
exports.getMuseumById = asyncHandler(
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

    res.status(200).json(museum);
  }
);

// @desc    Get single museum by userId (manager)
// @route   GET /museum?userId=
// @access  Public
exports.getMuseumByUserId = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    const museum: IMuseumResponse | null = await Museum.findOne({
      userId: req.query.userId,
    });

    if (!museum) {
      return next(
        new ErrorResponse(
          `Museum not found with user id of ${req.query.userId}`,
          404
        )
      );
    }

    res.status(200).json(museum);
  }
);

// @desc    Create new museum
// @route   POST /museum
// @access  Private
exports.createMuseum = asyncHandler(
  async (
    req: GenericRequestWithUser<{}, {}, IMuseumCoreData>,
    res: Response,
    next: any
  ) => {
    // Add user to req.body
    req.body.userId = req.user.id || req.user.userId || req.user._id;

    const museum: IMuseumResponse | null = await Museum.create(req.body);

    res.status(200).json(museum);
  }
);

// @desc    Update museum by id or slug
// @route   PATCH /museum/:museumId
// @access  Private
exports.updateMuseum = asyncHandler(
  async (
    req: GenericRequestWithUser<any, {}, IMuseumCoreData>,
    res: Response,
    next: any
  ) => {
    // Find museum by id
    const museum: IMuseumResponse | null = await Museum.findOne({
      museumId: req.params.museumId,
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

    req.body.userId = req.user.id || req.user.userId || req.user._id;

    // Update museum
    const query: IMuseumResponse | null = await Museum.findOneAndUpdate(
      { museumId: museum.museumId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(query);
  }
);
