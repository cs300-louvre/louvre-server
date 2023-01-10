import { Schema, model, connect, Types } from "mongoose";

import { IMuseumResponse } from "../types";
import Post from "./Post";
import Rating from "./Rating";
import Event from "./Event";
import Ticket from "./Ticket";
import Follow from "./Follow";

const MuseumSchema = new Schema<IMuseumResponse>({
  name: {
    type: String,
    required: [true, "Please add a name"],
    // unique: true,
  },
  museumId: { type: String, unique: true, index: true },
  thumbnailUrl: {
    type: String,
    default: "no-photo.jpg",
  },
  coverUrl: {
    type: String,
    default: "no-photo.jpg",
  },
  genre: {
    type: String,
    enum: ["new", "general", "natural", "science", "history", "art", "virtual"],
    required: [true, "Please add a genre"],
  },
  numOfFollowers: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ticketPrice: {
    type: Number,
    default: 0,
  },
  sales: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: [true, "Please add a location"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must can not be more than 5"],
    default: 1,
  },
  createdAt: String,
  userId: {
    type: String,
    required: [true, "Please add a userId"],
  },
});

// Create museumId
MuseumSchema.post("save", async function () {
  if (this.museumId) {
    return;
  }
  this.museumId = this._id.toString();
  this.save();
});

// Delete _id and __v from the response
MuseumSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
});

// A pre-hook to set the useId to the current user before saving
MuseumSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = Date.now().toString();
  }
  next();
});

MuseumSchema.pre("remove", async function (this: IMuseumResponse, next: any) {
  console.log(`Museum with Id ${this.museumId} is being removed ...`);
  await Rating.deleteMany({ museumId: this.museumId, eomId: this.museumId });
  await Post.deleteMany({ eomId: this.museumId });
  await Ticket.deleteMany({ museum: this.museumId });
  await Event.deleteMany({ museumId: this.museumId });
  await Follow.deleteMany({ museum: this.museumId });

  next();
});

export default model<IMuseumResponse>("Museum", MuseumSchema);