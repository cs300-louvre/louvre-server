import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse";

import { Request, Response } from "express";
import { RequestWithUser } from "../utils/requestWithUser";
import config from "../config/config";
import asyncHandler from "express-async-handler";
import User from "../models/User";

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

// Grant access to specific role
// can be passed in a list of roles (separated by comma)
exports.checkRoles = (...roles: string[]) => {
  // return a middleware function
  return (req: RequestWithUser, res: any, next: any) => {
    // check if the list of roles does not include the user's role from the request object
    // req.user is set in the protect middleware
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    return next();
  };
};
