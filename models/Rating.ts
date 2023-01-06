import { Schema, model, connect, Types } from "mongoose";

import { IMuseumResponse } from "../types";
import Museum from "./Museum";
import Event from "./Event";

export type IRatingSchema = {
  _id?: string | Types.ObjectId;
  ratingId?: string;
  userId: string;
  eomId: string;
  museum?: any;
  event?: any;
  thumbnailUrl: string;
  rating: number;
  content: string;
  userName: string;
  createdAt: string;
  IEOM: "event" | "museum";

  updateRating(eomId: string, IEOM: "event" | "museum"): Promise<void>;
};

const RatingSchema = new Schema<IRatingSchema>({
  ratingId: { type: String, unique: true, index: true },
  userId: {
    type: String,
    ref: "User",
    index: true,
  },
  eomId: {
    type: String,
  },
  museum: {
    type: String || null,
    default: null,
    ref: "Museum",
    index: true,
  },
  event: {
    type: String || null,
    default: null,
    ref: "Event",
    index: true,
  },
  thumbnailUrl: {
    type: String,
    default: "no-photo.jpg",
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must can not be more than 5"],
    default: 1,
  },
  content: {
    type: String,
    required: [true, "Please add a description"],
  },
  userName: {
    type: String,
  },
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
  IEOM: {
    type: String,
    enum: ["event", "museum"],
    required: true,
  },
});

RatingSchema.statics.updateRating = async function (
  eomId: string,
  IEOM: "event" | "museum"
) {
  console.log("updateRating");
  const obj = await this.aggregate([
    {
      $match: { eomId },
    },
    {
      $group: {
        _id: "$eomId",
        averageRating: { $avg: "$rating" },
        totalRating: { $sum: 1 },
      },
    },
  ]);

  try {
    const data = {
      rating: obj[0].averageRating,
      numOfReviews: obj[0].totalRating,
    };

    if (IEOM === "museum") {
      await Museum.findByIdAndUpdate(eomId, data);
    } else {
      await Event.findByIdAndUpdate(eomId, data);
    }
  } catch (err) {
    console.error(err);
  }
};

RatingSchema.post("save", async function () {
  await (this.constructor as any).updateRating(this.eomId, this.IEOM);

  if (this.ratingId && (this.museum || this.event)) {
    return;
  }

  this.ratingId = this._id.toString();
  if (this.IEOM === "museum") {
    this.museum = this.eomId;
  } else {
    this.event = this.eomId;
  }

  this.save();
});

// Update museum/event average rating after remove a rating
RatingSchema.post<IRatingSchema>("remove", async function () {
  await (this.constructor as any).updateRating(this.eomId, this.IEOM);
});

export default model<IRatingSchema>("Rating", RatingSchema);
