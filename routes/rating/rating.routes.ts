// const express = require("express");
import * as express from "express";

const ratingAPI = require("../../controllers/rating.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(ratingAPI.getRatingsByEomId)
  .post(auth.verifyToken, ratingAPI.createRating);

module.exports = router;
