// const express = require("express");
import * as express from "express";

const ratingAPI = require("../../controllers/post.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(ratingAPI.getPostByEomId)
  .post(auth, ratingAPI.postPost);

module.exports = router;
