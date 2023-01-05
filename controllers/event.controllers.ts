import { Response, Request } from "express";
import asyncHandler from "express-async-handler";

import Museum from "../models/Museum";
import Event from "../models/Event";
import type {
  IMuseumResponse,
  IMuseumCoreData,
  IEventCoreData,
} from "../types";
import ErrorResponse from "../utils/errorResponse";
import {
  RequestWithUser,
  GenericRequestWithUser,
} from "../utils/requestWithUser";

// @desc    Get all events (can be filtered by genre)
// @route   GET /events[?genre=history]
// @access  Public
exports.getEvents = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    let events: any | null;

    if (req.query.genre) {
      events = await Event.find({
        genre: { $regex: req.query.genre, $options: "i" },
      });
    } else {
      events = await Event.find();
    }

    // sort by createdAt
    events.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    //  add isFollowedByUser for each event in the list
    if (req.user) {
      for (let i = 0; i < events.length; i++) {
        events[i].setIsFollowedByUser(req.user._id);
      }
    }

    res.status(200).json({
      data: events as IMuseumResponse[] | null,
    });
  }
);

// @desc    Create a new event
// @route   POST /events
// @access  Private
exports.createEvent = asyncHandler(
  async (
    req: GenericRequestWithUser<{}, {}, IEventCoreData, {}>,
    res: Response,
    next: any
  ) => {
    // get the museum of the current user
    const museum: IMuseumResponse | null = await Museum.findOne({
      userId: req.user._id,
    });

    if (!museum) {
      return next(
        new ErrorResponse(`Museum of manager ${req.user._id} not found`, 404)
      );
    }

    const event = await Event.create({
      ...req.body,
      userId: req.user._id,
      museumId: museum.museumId,
      museumName: museum.name,
    });

    res.status(201).json({
      data: event,
    });
  }
);