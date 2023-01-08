import { Schema, model, connect, Types } from "mongoose";

import { getConversationId } from "../utils/getConversationId";

export type IConversationSchema = {
  conversationId: string;
  userId1: any;
  userId2: any;
  createdAt: string;
  updatedAt: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastMessageBy: string | null;
};

const ConversationSchema = new Schema<IConversationSchema>({
  conversationId: {
    type: String,
    unique: true,
    index: true,
  },
  userId1: {
    type: String,
    required: [true, "Please add a userId1"],
  },
  userId2: {
    type: String,
    required: [true, "Please add a userId2"],
  },
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
  updatedAt: {
    type: String,
    default: null,
  },
  lastMessage: {
    type: String,
    default: null,
  },
  lastMessageAt: {
    type: String,
    default: null,
  },
  lastMessageBy: {
    type: String,
    default: null,
  },
});

// Create conversation id from userId1 and userId2
ConversationSchema.pre("save", async function (next) {
  if (!this.conversationId) {
    this.conversationId = getConversationId(this.userId1, this.userId2);
  }
  next();
});

export default model<IConversationSchema>("Conversation", ConversationSchema);
