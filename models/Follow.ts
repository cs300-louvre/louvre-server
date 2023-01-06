import { Schema, model, connect, Types, PopulateOption } from "mongoose";
import Event from "./Event";
import Museum from "./Museum";

export type IFollowSchema = {
  _id?: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  museum?: any;
  event?: any;
  createdAt?: string | null;

  increaseNumOfFollowers?(): void;
  decreaseNumOfFollowers?(): void;
};

const FollowSchema = new Schema<IFollowSchema>({
  userId: {
    type: String,
    ref: "User",
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
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
});

// Method to increase the number of followers of the museum or event
FollowSchema.methods.increaseNumOfFollowers = async function () {
  if (this.museum) {
    const museum = await Museum.findById(this.museum);
    if (museum) {
      museum.numOfFollowers += 1;
      museum.save();
    }
  }

  if (this.event) {
    const event = await Event.findById(this.event);
    if (event) {
      event.numOfFollowers += 1;
      event.save();
    }
  }
};

// Method to decrease the number of followers of the museum or event
FollowSchema.methods.decreaseNumOfFollowers = async function () {
  if (this.museum) {
    const museum = await Museum.findById(this.museum);
    if (museum) {
      museum.numOfFollowers -= 1;
      museum.save();
    }
  }

  if (this.event) {
    const event = await Event.findById(this.event);
    if (event) {
      event.numOfFollowers -= 1;
      event.save();
    }
  }
};

export default model<IFollowSchema>("Follow", FollowSchema);
