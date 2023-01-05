import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestWithUser } from "../utils/requestWithUser";
import sanitizedConfig from "../config/config";

import { IGetMeResponse } from "../types";

// @desc    Get current logged in user
// @route   GET /api/users/current
// @access  Private
exports.getMe = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const me: IGetMeResponse = {
      userId: req.user.userId || req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      thumbnailUrl: req.user.thumbnailUrl,
    };

    res.status(200).json({ data: me });
  }
);
