import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse";

import Message from "../models/Message";
import Conversation from "../models/Conversation";
import { IMessageResponse } from "../types";
import { RequestWithUser } from "../utils/requestWithUser";
import { parseConversationId } from "../utils/getConversationId";

// @desc    Get all messages from conversation id
// @route   GET /message?conversationId=
// @access  Private
exports.getMessagesByConversationId = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const conversationId = req.query.conversationId as string;

    if (!conversationId) {
      return next(new ErrorResponse("Conversation id is required", 400));
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
      return next(new ErrorResponse("Conversation id is required", 400));
    }

    let conversation = await Conversation.findOne({
      conversationId: conversationId,
    });

    if (!conversation) {
      // Parse conversationId to get userId1 and userId2
      const [userId1, userId2] = parseConversationId(conversationId);
      conversation = await Conversation.create({
        conversationId: conversationId,
        userId1: userId1,
        userId2: userId2,
      });
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

    // Update conversation
    conversation.updatedAt = newMessage.sentAt;
    conversation.lastMessage = content;
    conversation.lastMessageAt = newMessage.sentAt;
    conversation.lastMessageBy = req.user._id;
    conversation.save(); // Don't need to await here

    res.status(201).json(newMessage);
  }
);
