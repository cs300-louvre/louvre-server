const User = require("../models/User");

const { Types, isValidObjectId } = require("mongoose");
import { Response, Request } from "express";
import asyncHandler from "express-async-handler";

import Ticket from "../models/Ticket";
import ErrorResponse from "../utils/errorResponse";
import type { ITicketCoreData, ITicketResponse } from "../types";
import {
  RequestWithUser,
  GenericRequestWithUser,
} from "../utils/requestWithUser";

// @desc    Get ticket by id
// @route   GET /ticket/:ticketId
// @access  Public
exports.getTicketById = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const ticket = await Ticket.findOne({
      ticketId: req.params.ticketId,
    });

    if (!ticket) {
      return next(
        new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json(ticket);
  }
);

// @desc    Check in ticket
// @route   PUT /ticket/:ticketId/checkin
// @access  Private

exports.checkIn = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(
        new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
      );
    }

    ticket.status = "used";
    await ticket.save();

    res.status(200).json(ticket);
  }
);
