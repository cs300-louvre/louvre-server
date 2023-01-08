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
// @route   GET /event[?genre=history]
// @route   GET /museum/:museumId/event[?genre=history]
// @access  Public
exports.getEvents = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    let events: any | null;

    let query: any = {};

    if (req.query.genre) {
      query.genre = { $regex: req.query.genre, $options: "i" };
    }

    if (req.params.museumId) {
      query.museumId = req.params.museumId;
    }

    events = await Event.find(query);

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

    res.status(200).json(events);
  }
);

// @desc    Create a new event
// @route   POST /event
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

    res.status(201).json(event);
  }
);

// @desc    Get a single event
// @route   GET /event/:id
// @access  Public
exports.getEvent = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const event: any | null = await Event.findById(req.params.id);

    if (!event) {
      return next(
        new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
      );
    } else {
      if (req.user) {
        event.setIsFollowedByUser(req.user._id);
      }
    }

    res.status(200).json(event);
  }
);

// @desc    Update an event
// @route   PATCH /event/:eventId
// @access  Private
exports.updateEvent = asyncHandler(
  async (
    req: GenericRequestWithUser<any, {}, IEventCoreData, {}>,
    res: Response,
    next: any
  ) => {
    const event: any | null = await Event.findById(req.params.eventId);

    if (!event) {
      return next(
        new ErrorResponse(
          `Event not found with id of ${req.params.eventId}`,
          404
        )
      );
    }

    // check if user is the owner of the event
    if (event.userId.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse(
          `User ${req.user._id} is not authorized to update this event`,
          401
        )
      );
    }

    event.set(req.body);

    await event.save();

    res.status(200).json(event);
  }
);
