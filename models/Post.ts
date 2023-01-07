import { Schema, model, connect, Types } from "mongoose";

import { IPostResponse } from "../types";

export type IPostSchema = {
    _id?: string | Types.ObjectId;
    createdAt: string;
    title: string;
    body: string;
    imageUrl: string;
    eomId: string;
    postId: string;
    IEOM: "event" | "museum";
  };

const PostSchema = new Schema<IPostSchema>({
    createdAt: {
        type: String,
        default: Date.now().toString(),
      },
    title: {
        type: String,
        required: [true, "Please add a title"],
    },
    body: {
        type: String,
        required: [true, "Please add a body"],  
    },
    imageUrl: {
        type: String,
        required: [true, "Please add an image"],
    },
    eomId: {
        type: String,
        required: [true, "Please add an eomId"],
    },
    postId: {
        type: String,
        unique: true,
        index: true,
    },
});

// Delete _id and __v from the response
PostSchema.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret._id;
      delete ret.__v;
    },
  });

// A pre-hook to set the useId to the current user before saving
PostSchema.pre("save", function (next) {
    if (!this.createdAt) {
      this.createdAt = Date.now().toString();
    }
    next();
  });
  

PostSchema.post("save",function () {
    if (this.postId) {
        return;
    }
    this.postId = this._id.toString();
    this.save();
},
);

export default model<IPostSchema>("Post", PostSchema);





