import { Schema, model, connect, Types } from "mongoose";

import { IPostResponse } from "../types";

// export type IPostCoreData = {
//     title: string;
//     body: string;
//     imageBase64: string;
//     eomId: string;
//   };

const PostSchema = new Schema<IPostResponse>({
    title: {
        type: String,
        required: [true, "Please add a title"],
    },
    body: {
        type: String,
        required: [true, "Please add a body"],
    },
    eomId: {
        type: String,
        required: [true, "Please add an eomId"],
    },
});