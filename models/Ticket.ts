import { Schema, model, connect, Types } from "mongoose";

import { ITicketResponse, ITicketStatus } from "../types";

export type ITicketSchema = {
  ticketId: string;
  userId: string;
  event?: string | null;
  museum: string; // MuseumID of event of of museum of the ticket
  price: number;
  purchasedAt: string;
  qrCodeUrl?: string;
  status: ITicketStatus;
};

const TicketSchema = new Schema<ITicketSchema>({
  ticketId: {
    type: String,
    unique: true,
    index: true,
  },
  userId: {
    type: String,
    required: [true, "Please add a userId"],
  },
  event: { type: String, default: null, ref: "Event" },
  museum: {
    type: String,
    ref: "Museum",
    required: [true, "Please add a museumId"],
  },
  purchasedAt: {
    type: String,
    required: [true, "Please add a purchasedAt"],
  },
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["wait", "paid", "used"],
    required: [true, "Please add a status"],
  },
});

// A pre-hook to set the useId to the current user before saving
TicketSchema.pre("save", function (next) {
  if (!this.purchasedAt) {
    this.purchasedAt = Date.now().toString();
  }
  next();
});

// Create ticketId
TicketSchema.post("save", function () {
  if (this.ticketId) {
    return;
  }
  this.ticketId = this._id.toString();
  this.save();
});

export default model<ITicketSchema>("Ticket", TicketSchema);
