import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse";

import { RequestWithUser } from "../utils/requestWithUser";
import Message from "../models/Message";
import { IMessageResponse } from "../types";

// @desc    Get all messages from conversation id
// @route   GET /message?conversationId=
// @access  Private
exports.getMessagesByConversationId = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const conversationId = req.query.conversationId as string;

    if (!conversationId) {
      res.status(400);
      throw new Error("Conversation id is required");
    }

    // Sort by createdAt where latest message is at first
    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ createdAt: -1 });

    const messagesResponse: IMessageResponse[] = messages.map((message) => {
      return {
        messageId: message.messageId,
        conversationId: message.conversationId,
        userId: message.userId,
        userName: message.userName,
        thumbnailUrl: message.thumbnailUrl,
        content: message.content,
        sentAt: message.sentAt,
      };
    });

    res.status(200).json(messagesResponse);
  }
);

// @desc    Create a message
// @route   POST /message
// @access  Private
exports.createMessage = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const { content, conversationId } = req.body;

    if (!req.body.conversationId) {
      res.status(400);
      throw new Error("Conversation id is required");
    }

    const newMessage = await Message.create({
      conversationId: conversationId,
      userId: req.user._id,
      userName: req.user.name,
      thumbnailUrl: req.user.thumbnailUrl,
      content: content,
    });

    if (!newMessage) {
      throw new ErrorResponse("Message could not be created", 500);
    }

    res.status(201).json(newMessage);
  }
);
