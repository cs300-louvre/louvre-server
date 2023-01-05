import { Schema, model, connect, Types } from "mongoose";

import { IMuseumResponse } from "../types";

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
    max: [10, "Rating must can not be more than 10"],
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

export default model<IMuseumResponse>("Museum", MuseumSchema);

// // Create museum slug from the name
// MuseumSchema.pre("save", async function (next) {
//   if (!this.isModified("title")) {
//     next();
//   }
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// // Create custom museum id
// MuseumSchema.post("save", async function () {
//   if (this.mid) return;

//   this.mid = "m" + this._id;
//   this.save();
// });
