import { Schema, model, connect, Types } from "mongoose";

import { INotificationResponse } from "../types";

export type INotificationSchema = {
    _id?: string | Types.ObjectId;
    type: "museum" | "event" | "system" | "message";
    thumbnailUrl: string;
    name: string;
    content: string;
    sourceId: string;
    notificationId: string;
    userID: string;
};

const NotificationSchema = new Schema<INotificationSchema>({
    type: {
        type: String,
        required: [true, "Please add a type"],
        },
    thumbnailUrl: {
        type: String,
        required: [true, "Please add a thumbnailUrl"],
        },
    name: {
        type: String,
        required: [true, "Please add a name"],
        },
    content: {
        type: String,
        required: [true, "Please add a content"],
    },
    sourceId: {
        type: String,
        required: [true, "Please add a sourceId"],
    },
    notificationId: {
        type: String,
        unique: true,
        index: true,
    },
    userID: {
        type: String,
        required: [true, "Please add a userID"],
    },
});

// A pre-hook to set the useId to the current user before saving
NotificationSchema.pre("save", function() {
    if (!this.notificationId) {
        this.notificationId = this._id.toString();
    }
});
    

export default model<INotificationSchema>("Notification", NotificationSchema);

    
