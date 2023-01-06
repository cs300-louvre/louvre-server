import { Schema, model, connect, Types } from "mongoose";

import { ITicketResponse } from "../types";

const TicketSchema = new Schema<ITicketResponse>({
    ticketId: { 
        type: String, 
        unique: true, 
        index: true 
    },
    userId: { 
        type: String, 
        required: [true, "Please add a userId"] 
    },
    eventId: { type: String },
    museumId: { 
        type: String, 
        required: [true, "Please add a museumId"] 
    },
    purchasedAt: { 
        type: String, 
        required: [true, "Please add a purchasedAt"] 
    },
    thumbnailUrl: {
        type: String,
        default: "no-photo.jpg",
      },
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    price: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,
        required: [true, "Please add a location"],
    },
    startTime: { type: String },
    endTime: { type: String },
    qrCodeUrl: { type: String },
    status: {
        type: String,
        enum: ["wait", "paid", "used"],
        required: [true, "Please add a status"],
    },
});

// Create ticketId
TicketSchema.pre("save", async function () {
    if (this.ticketId) {
        return;
      }
    this.ticketId = new Types.ObjectId().toHexString();
    this.save();
});

// A pre-hook to set the useId to the current user before saving
TicketSchema.pre("save", function (next) {
    if (!this.purchasedAt) {
      this.purchasedAt = Date.now().toString();
    }
    next();
  });
  

export default model<ITicketResponse>("Ticket", TicketSchema);