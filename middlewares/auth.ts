const User = require("../models/User");

import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse";

import { Response } from "express";
import { RequestWithUser } from "../utils/requestWithUser";
import config from "../config/config";
import asyncHandler from "express-async-handler";

interface JwtPayload {
  id: string;
}

// verifyToken
exports.verifyToken = asyncHandler(
  async (
    req: RequestWithUser,
    res: Response,
    next: any,
    strict: boolean = true
  ) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      // Set token from cookie
      token = req.cookies.token;
    } else {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    // Make sure token exists
    if (!token) {
      if (strict) {
        return next(
          new ErrorResponse("Not authorized to access this route", 401)
        );
      } else {
        req.user = null;
        next();
      }
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    // get user from database and attach to request
    req.user = await User.findById(decodedToken.id);

    next();
  }
);

exports.verifyTokenChill = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    return exports.verifyToken(req, res, next, false);
  }
);
