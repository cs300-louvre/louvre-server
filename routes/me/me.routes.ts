// const express = require("express");
import * as express from "express";

const meAPI = require("../../controllers/me.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(auth.verifyToken, meAPI.getMe);

router
  .route("/museum")
  .get(auth.verifyToken, meAPI.getFollowedMuseums)
  .put(auth.verifyToken, meAPI.followMuseum);

router
  .route("/event")
  .get(auth.verifyToken, meAPI.getFollowedEvents)
  .put(auth.verifyToken, meAPI.followEvent);

router.route("/rating").get(auth.verifyToken, meAPI.getRatings);

router
  .route("/ticket")
  .get(auth.verifyToken, meAPI.getMyTickets)


module.exports = router;
