import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { RequestWithUser } from "../utils/requestWithUser";

import Rating from "../models/Rating";
import { IRatingResponse } from "../types";
import Museum from "../models/Museum";
import Event from "../models/Event";

// @desc    Get ratings by eomId
// @route   GET /rating?eomId=xxx
// @access  Public
exports.getRatingsByEomId = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    const eomId = req.query.eomId as string;

    if (!eomId) {
      res.status(400);
      throw new Error("eomId is required");
    }

    const ratings = await Rating.find({ eomId });

    const ratingsResponse: IRatingResponse[] = ratings.map((rating) => {
      return {
        ratingId: rating.ratingId as string,
        userId: rating.userId as string,
        eomId: rating.eomId as string,
        thumbnailUrl: rating.thumbnailUrl,
        rating: rating.rating,
        content: rating.content,
        userName: rating.userName,
        createdAt: rating.createdAt,
      };
    });

    res.status(200).json(ratingsResponse);
  }
);

// @desc    Create rating
// @route   POST /rating
// @access  Private
exports.createRating = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const { eomId, rating, content } = req.body;
    const { thumbnailUrl, name } = req.user;
    const userId = req.user.userId || req.user._id.toString();

    let ratingDoc: any = await Rating.findOne({ userId, eomId });

    let IEOM = "";
    const isMuseumRating = await Museum.findById(eomId);
    if (isMuseumRating) {
      IEOM = "museum";
    } else {
      IEOM = "event";
    }

    if (ratingDoc === null) {
      ratingDoc = await Rating.create({
        userId,
        eomId,
        rating,
        content,
        thumbnailUrl,
        userName: name,
        IEOM,
      });
    } else {
      ratingDoc.rating = rating;
      ratingDoc.content = content;
      await ratingDoc.save();
    }

    const ratingResponse: IRatingResponse = {
      ratingId: ratingDoc.ratingId as string,
      userId: ratingDoc.userId as string,
      eomId: ratingDoc.eomId as string,
      thumbnailUrl: ratingDoc.thumbnailUrl,
      rating: ratingDoc.rating,
      content: ratingDoc.content,
      userName: ratingDoc.userName,
      createdAt: ratingDoc.createdAt,
    };

    res.status(201).json(ratingResponse);
  }
);
