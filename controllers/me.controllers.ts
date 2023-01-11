import User from "../models/User";
import { IRatingResponse, ISignInResponse, ITicketResponse } from "./../types";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import {
  IGetMeResponse,
  IFollowedMuseum,
  IFollowedEvent,
  IMuseumResponse,
  IEventResponse,
  IConversationPreviewResponse,
} from "../types";

import Follow, { IFollowSchema } from "../models/Follow";
import Rating, { IRatingSchema } from "../models/Rating";
import Ticket from "../models/Ticket";
import Conversation from "../models/Conversation";
import Museum from "../models/Museum";
import Event, { IEventSchema } from "../models/Event";
import ErrorResponse from "../utils/errorResponse";
import { RequestWithUser } from "../utils/requestWithUser";

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
    const followedMuseums: any = await Follow.find({
      userId: req.user.userId || req.user._id,
      museum: { $ne: null },
    })
      .lean()
      .populate({
        path: "museum",
        model: "Museum",
        // select all attributes
        select: "-__v",
      });

    const museums: IMuseumResponse[] = followedMuseums.map((follow: any) => {
      return {
        ...follow.museum,
      } as IMuseumResponse;
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
    })
      .lean()
      .populate({
        path: "event",
        model: "Event",
      });

    const events: IEventResponse[] = followedEvents.map((follow) => {
      return {
        ...follow.event,
      } as IEventResponse;
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
    })
      .populate({
        path: "museum",
        model: "Museum",
        select: "name thumbnailUrl location",
      })
      .populate({
        path: "event",
        model: "Event",
        select: "name thumbnailUrl location startTime endTime",
      });

    const ticketsResponse: ITicketResponse[] = tickets.map((ticket: any) => {
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

      return {
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
      } as ITicketResponse;
    });

    res.status(200).json(ticketsResponse);
  }
);

// @desc    Purchase ticket
// @route   Post /me/ticket?type=${type}&eomId=${eomId}
// @access  Private
exports.purchaseTicket = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const userId = req.user.userId || req.user._id;
    const type = req.query.type as string;
    const eomId = req.query.eomId as string;

    if (!type || !eomId) {
      return next(
        new ErrorResponse("Invalid request. type and eomId required", 400)
      );
    }

    let museumId: string = "";
    let target: any = null;

    if (type === "event") {
      target = await Event.findOne({ eventId: eomId });
      museumId = target.museumId;
    } else if (type === "museum") {
      museumId = eomId;
      target = await Museum.findOne({ museumId: eomId });
    }

    const query = {
      userId: userId,
      museum: museumId as string | null,
      event: null,
      price: target.ticketPrice,
      status: "paid",
    };

    if (type === "event") {
      query.event = target._id;
    }

    const ticket = await Ticket.create(query);

    res.status(200).json(ticket);
  }
);

// @desc    Get my conversation previews
// @route   GET /me/conversation_notification
// @access  Private
exports.getConversationPreviews = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const userId = req.user.userId || req.user._id;

    const conversations = await Conversation.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    })
      .populate({
        path: "userId1",
        model: "User",
        select: "name thumbnailUrl userId",
      })
      .populate({
        path: "userId2",
        model: "User",
        select: "name thumbnailUrl userId",
      });

    const conversationPreviews: IConversationPreviewResponse[] =
      conversations.map((conversation) => {
        let sender: any = conversation.lastMessageBy;
        let receiver: any | null = null;
        let otherUser: any | null = null;

        // Get sender and receiver of last message
        if (conversation.userId1.userId === sender) {
          sender = conversation.userId1;
          receiver = conversation.userId2;
        } else {
          sender = conversation.userId2;
          receiver = conversation.userId1;
        }

        // Get other user in conversation
        if (conversation.userId1.userId === userId) {
          otherUser = conversation.userId2;
        } else {
          otherUser = conversation.userId1;
        }

        return {
          conversationId: conversation.conversationId,
          name: sender.name,
          content: conversation.lastMessage,
          userId: otherUser.userId,
          thumbnailUrl: otherUser.thumbnailUrl,
          sentAt: conversation.lastMessageAt,
        } as IConversationPreviewResponse;
      });

    res.status(200).json(conversationPreviews);
  }
);

// @desc    Change user password
// @route   POST /users/change_password
// @access  Private
exports.changePassword = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const { currentPassword, newPassword } = req.body;

    const user: any = await User.findById(req.user.id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return next(new ErrorResponse("Incorrect password", 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);
