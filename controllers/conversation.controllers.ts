import { Response, Request } from "express";
import asyncHandler from "express-async-handler";

import {
  RequestWithUser,
  GenericRequestWithUser,
} from "../utils/requestWithUser";
import Conversation from "../models/Conversation";

// @desc    Get all conversations from user id
// @route   GET /conversation[?userId=]
// @access  Private
exports.getConversationIdByUserId = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const userId = req.query.userId as string;

    const conversations = await Conversation.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    });

    const conversationIds = conversations.map((conversation) => {
      return conversation.conversationId;
    });

    res.status(200).json(conversationIds);
  }
);
