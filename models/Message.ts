import { Schema, model, connect, Types } from "mongoose";

import { IMessageResponse } from "../types";
import Conversation from "./Conversation";

const MessageSchema = new Schema<IMessageResponse>({
  conversationId: {
    type: String,
    index: true,
    ref: "Conversation",
  },
  userId: {
    type: String,
    required: [true, "Please add a userId"],
    ref: "User",
  },
  userName: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
    default: "no-photo.jpg",
  },
  content: {
    type: String,
    required: [true, "Please add a content"],
  },
  sentAt: {
    type: String,
    default: Date.now().toString(),
  },
  messageId: {
    type: String,
    unique: true,
    index: true,
  },
});

// Update conversation with last message when this message is created
MessageSchema.pre("save", async function () {
  if (this.isNew) {
    const conversation = await Conversation.findOne({
      conversationId: this.conversationId,
    });

    if (!conversation) {
      return;
    }

    conversation.lastMessage = this.content;
    conversation.lastMessageAt = this.sentAt;
    conversation.lastMessageBy = this.userId;
    conversation.save();
  }
});

// Create ticketId
MessageSchema.post("save", async function () {
  if (this.messageId) {
    return;
  }

  this.messageId = this._id.toString();
  this.save();
});

export default model<IMessageResponse>("Message", MessageSchema);
