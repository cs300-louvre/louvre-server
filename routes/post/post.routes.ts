// const express = require("express");
import * as express from "express";

const postAPI = require("../../controllers/posts.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(postAPI.getPostsByEomId)
  .post(auth.verifyToken, postAPI.postPost);

module.exports = router;
