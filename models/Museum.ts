import { Schema, model, connect, Types } from 'mongoose';
import slugify from 'slugify';

import { IMuseumResponse } from '../types';

const MuseumSchema = new Schema<IMuseumResponse>({
  name: {
    type: String,
    required: [true, "Please add a name"],
    // unique: true,
  },
  museumId: { type: String, unique: true },
  thumbnailUrl: String,
  coverUrl: String,
  genre: {
    type: String,
    enum: [
      "new",  
      "general",
      "natural",
      "science",
      "history",
      "art",
      "virtual",
    ],
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
  },
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
  this.museumId = "m" + this._id;
  this.save();
});

// Delete _id and __v from the response
MuseumSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
});



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

module.exports = model<IMuseumResponse>("Museum", MuseumSchema);
