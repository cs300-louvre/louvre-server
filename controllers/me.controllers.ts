import { IRatingResponse, ISignInResponse, ITicketResponse } from "./../types";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { RequestWithUser } from "../utils/requestWithUser";

import {
  IGetMeResponse,
  IFollowedMuseum,
  IFollowedEvent,
  IMuseumResponse,
  IEventResponse,
} from "../types";
import Follow, { IFollowSchema } from "../models/Follow";
import Museum from "../models/Museum";
import Event from "../models/Event";
import Rating, { IRatingSchema } from "../models/Rating";
import Ticket from "../models/Ticket";

// @desc    Get current logged in user
// @route   GET /me
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

    res.status(200).json(me);
  }
);

// @desc    Follow museum
// @route   POST /me/museum?museumId=123
// @access  Private
exports.followMuseum = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const follow: IFollowSchema = {
      userId: req.user.userId || (req.user._id as string), // userId: userId,
      museum: req.query.museumId as string,
    };

    let followMuseum: any = await Follow.findOne(follow);

    let message = "";
    if (followMuseum === null) {
      followMuseum = await Follow.create(follow);
      followMuseum.increaseNumOfFollowers();
      message = "Followed museum";
    } else {
      await followMuseum.remove();
      followMuseum.decreaseNumOfFollowers();
      message = "Unfollowed museum";
    }

    res.status(200).json({ message: message });
  }
);

// @desc    Follow event
// @route   POST /me/event
// @access  Private
exports.followEvent = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const follow: IFollowSchema = {
      userId: req.user.userId || (req.user._id as string), // userId: userId,
      event: req.query.eventId as string,
    };

    // find with exact
    let followEvent: any = await Follow.findOne(follow);

    let message = "";
    if (followEvent === null) {
      followEvent = await Follow.create(follow);
      followEvent.increaseNumOfFollowers();
      message = "Followed event";
    } else {
      await followEvent.remove();
      followEvent.decreaseNumOfFollowers();
      message = "Unfollowed event";
    }

    res.status(200).json({ message: message });
  }
);

// @desc    Get followed museums
// @route   GET /me/museum
// @access  Private
exports.getFollowedMuseums = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const followedMuseums: IFollowSchema[] = await Follow.find({
      userId: req.user.userId || req.user._id,
      museum: { $ne: null },
    }).populate({
      path: "museum",
      model: "Museum",
      select: "name thumbnailUrl rating museumId",
    });

    const museums: IFollowedMuseum[] = followedMuseums.map((follow) => {
      return {
        museumId: follow.museum.museumId,
        name: follow.museum.name,
        thumbnailUrl: follow.museum.thumbnailUrl,
        rating: follow.museum.rating as number,
      } as IFollowedMuseum;
    });

    res.status(200).json(museums);
  }
);

// @desc    Get followed events
// @route   GET /me/event
// @access  Private
exports.getFollowedEvents = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const followedEvents: IFollowSchema[] = await Follow.find({
      userId: req.user.userId || req.user._id,
      event: { $ne: null },
    }).populate({
      path: "event",
      model: "Event",
      select: "name thumbnailUrl rating eventId",
    });

    const events: IFollowedEvent[] = followedEvents.map((follow) => {
      return {
        eventId: follow.event.eventId,
        name: follow.event.name,
        thumbnailUrl: follow.event.thumbnailUrl,
        rating: follow.event.rating as number,
      } as IFollowedEvent;
    });

    res.status(200).json(events);
  }
);

// @desc    Get my rating
// @route   GET /me/rating
// @access  Private
exports.getRatings = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const myRatings: IRatingSchema[] = await Rating.find({
      userId: req.user.userId || req.user._id.toString(),
    })
      .populate({
        path: "event",
        model: "Event",
        select: "thumbnailUrl",
      })
      .populate({
        path: "museum",
        model: "Museum",
        select: "thumbnailUrl",
      });

    const ratings: any[] = myRatings.map((rating) => {
      let curThumbnailUrl = "";

      if (rating.IEOM === "event") {
        curThumbnailUrl = rating.event.thumbnailUrl;
      } else if (rating.IEOM === "museum") {
        curThumbnailUrl = rating.museum.thumbnailUrl;
      }

      return {
        ratingId: rating.ratingId,
        userId: rating.userId,
        eomId: rating.eomId,
        thumbnailUrl: curThumbnailUrl,
        rating: rating.rating,
        content: rating.content,
        userName: rating.userName,
        createdAt: rating.createdAt,
      } as IRatingResponse;
    });

    res.status(200).json(ratings);
  }
);

// @desc    Get my tickets
// @route   GET /me/ticket
// @access  Private
exports.getMyTickets = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const tickets: ITicketResponse[] = await Ticket.find({
      userId: req.user.userId || req.user._id,
    }).populate({
      path: "ticket",
      model: "Ticket ",
      select: "name thumbnailUrl location status",
    });
    res.status(200).json(tickets);
  }
);

// @desc    Purchase ticket
// @route   Post /me/ticket?type=${type}&eomId=${eomId}
// @access  Private
// Anh Nam oiw cuu em =))) hong biem lam =))
