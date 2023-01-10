import { Schema, model } from "mongoose";

import { IEventGenre } from "../types";
import Rating from "./Rating";

export type IEventSchema = {
  genre: IEventGenre;
  name: string;
  description: string;
  location: string;
  thumbnailUrl: string;
  coverUrl: string;
  sales: number;
  eventId: string;
  isFollowedByUser: boolean;
  numOfFollowers: number;
  numOfReviews: number;
  ticketPrice: number;
  rating: number;
  museumId: string; // KHI USER UPLOAD EVENT LÊN THÌ SERVER CHỈ CÓ ĐƯỢC USER ID THÔI (THÔNG QUA TOKEN), SERVER PHẢI COI USER ĐÓ QUẢN LÍ MUSEUM NÀO RỒI CHÈN MUSEUM ID VÀO ĐÂY
  museumName: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  userId: string; // USER ID của người tạo ra event (tức là người quản lí cái musem tổ chức event)
};

const EventSchema = new Schema<IEventSchema>({
  genre: {
    type: String,
    enum: [
      "art",
      "education",
      "sport",
      "festival",
      "virtual",
      "volunteer",
      "corporate",
    ],
    required: [true, "Please add a genre"],
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    // unique: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  location: {
    type: String,
    required: [true, "Please add a location"],
  },
  thumbnailUrl: {
    type: String,
    default: "no-photo.jpg",
  },
  coverUrl: {
    type: String,
    default: "no-photo.jpg",
  },
  sales: {
    type: Number,
    default: 0,
  },
  eventId: { type: String },
  isFollowedByUser: {
    type: Boolean,
    default: false,
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
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must can not be more than 5"],
    default: 1,
  },
  museumId: {
    type: String,
  },
  museumName: String,
  startTime: String,
  endTime: String,
  createdAt: String,
  userId: {
    type: String,
    required: [true, "Please add a userId"],
  },
});

// Delete _id and __v from the response
EventSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
});

// A pre-hook to set the createdAt property
EventSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = Date.now().toString();
  }

  next();
});

// Create museumId from _id
EventSchema.post("save", async function () {
  if (this.eventId) {
    return;
  }

  this.eventId = this._id.toString();
  this.save();
});

// A method to set isFollowedByUser property
EventSchema.methods.setIsFollowedByUser = async function (userId: string) {
  // const isFollowedByUser = this.followers.some(
  //   (follower: any) => follower.userId.toString() === userId
  // );

  this.isFollowedByUser = false;
};

// EventSchema.pre("remove", async function (next) {
//   console.log(`Events being removed from museum ${this._id}`);

//   // await this.model("Course").deleteMany({ bootcamp: this._id });
//   await Rating.deleteMany({ eventId: this.eventId });
//   next();
// });


export default model<IEventSchema>("Event", EventSchema);
