import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse";

import { RequestWithUser } from "../utils/requestWithUser";
import Message from "../models/Post";
import { IPostResponse } from "../types";
import Post from "../models/Post";
import Museum from "../models/Museum";

// @desc    Get post by eomId
// @route   GET /post?eomId=xxx
// @access  Public
exports.getPostsByEomId = asyncHandler(
  async (req: Request, res: Response, next: any) => {
    const eomId = req.query.eomId as string;

    if (!eomId) {
      res.status(400);
      throw new Error("eomId is required");
    }

    const posts = await Post.find({ eomId });

    const postsResponse: IPostResponse[] = posts.map((post) => {
      return {
        createdAt: post.createdAt,
        title: post.title,
        body: post.body,
        imageUrl: post.imageUrl,
        eomId: post.eomId,
        postId: post.postId,  
      };
    });

    res.status(200).json(postsResponse);
  }
);

// @desc    Create Post
// @route   POST /post
// @access  Private
exports.postPost = asyncHandler(
  async (req: RequestWithUser, res: Response, next: any) => {
    const { eomId, title, body,imageBase64, } = req.body;
    let  postPost: any = await Post.findOne({eomId});
    
    if (postPost === null) {
        postPost = await Post.create({
            title: title,
            body: body,
            imageBase64,
            eomId,
      });
    } else {
        postPost.title = title;
        postPost.body =  body;
        await postPost.save();
    }

    const postsResponse: IPostResponse = {
        createdAt: postPost.createdAt,
        title: postPost.title,
        body: postPost.body,
        imageUrl: postPost.imageUrl as string,
        eomId: postPost.eomId as string,
        postId: postPost.postId,
      };
  
      res.status(200).json(postsResponse);
  }
);
