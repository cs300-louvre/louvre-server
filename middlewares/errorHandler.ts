import { ErrorResponse } from "../utils/errorResponse";
import { RequestWithUser } from "../utils/requestWithUser";
import { Response} from "express";

// References: https://expressjs.com/en/guide/error-handling.html
const errorHandler = (err: any, req: RequestWithUser, res: Response, next: any) => {
  let error = { ...err };

  error.message = err.message;

  // log to console for dev
  console.log(`${err}`.red);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Email has been used";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new ErrorResponse(message.toString(), 400);
  }

  // Wrong JWT token
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new ErrorResponse(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    token: null,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
