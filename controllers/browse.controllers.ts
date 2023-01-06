import { Response, Request } from "express";
import asyncHandler from "express-async-handler";

import Museum from "../models/Museum";
import ErrorResponse from "../utils/errorResponse";
import type { IMuseumResponse } from "../types";

// @desc    Get all museums with at most 3 museums per genres
// @route   GET /browse/museum
// @access  Public
exports.getBrowseMuseums = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    // Fetch all museums from the API
    const museums = await Museum.find();

    // sort museum by createdAt (timestamp string), newest first
    museums.sort((a, b) => {
      return parseInt(b.createdAt) - parseInt(a.createdAt);
    });

    // Group the museums by genre
    const museumsByGenre = museums.reduce((acc, museum) => {
      acc[museum.genre] = acc[museum.genre] || [];
      acc[museum.genre].push(museum);
      return acc;
    }, {} as { [genre: string]: IMuseumResponse[] });

    // Keep at most 3 museums for each genre
    const filteredMuseums = Object.entries(museumsByGenre).map(
      ([genre, museums]) => {
        return museums.slice(0, 3);
      }
    );

    // Flatten the array of museums
    const data = filteredMuseums.flat();

    res.status(200).json(data);
  }
);
