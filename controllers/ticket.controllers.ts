import User from "../models/User";

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
    const ticket: any = await Ticket.findOne({
      ticketId: req.params.ticketId,
    })
      .populate({
        path: "museum",
        model: "Museum",
        select: "name thumbnailUrl location museumId",
      })
      .populate({
        path: "event",
        model: "Event",
        select: "name thumbnailUrl location startTime endTime eventId",
      });

    if (!ticket) {
      return next(
        new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
      );
    }

    let eventId: any = null;
    let name: string = ticket.museum.name;
    let thumbnailUrl: string = ticket.museum.thumbnailUrl;
    let location: string = ticket.museum.location;
    let startTime: any = null;
    let endTime: any = null;

    if (ticket.event) {
      eventId = ticket.event.eventId;
      name = ticket.event.name;
      thumbnailUrl = ticket.event.thumbnailUrl;
      location = ticket.event.location;
      startTime = ticket.event.startTime;
      endTime = ticket.event.endTime;
    }

    let ticketResponse: ITicketResponse = {
      ticketId: ticket.ticketId,
      userId: ticket.userId,
      eventId: eventId,
      museumId: ticket.museum.museumId,
      purchasedAt: ticket.createdAt,
      thumbnailUrl: thumbnailUrl,
      name: name,
      price: ticket.price,
      location: location,
      startTime: startTime,
      endTime: endTime,
      status: ticket.status,
    };

    res.status(200).json(ticketResponse);
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
