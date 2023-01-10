// const express = require("express");
import * as express from "express";

const eventAPI = require("../../controllers/event.controllers");
const auth = require("../../middlewares/auth");

// Router with mergeParams: true to access params from parent router
const router = express.Router({ mergeParams: true });

router.route("/").get(auth.verifyTokenChill, eventAPI.getEvents);

router.route("/:eventId").get(auth.verifyTokenChill, eventAPI.getEvent);

router
  .route("/")
  .post(auth.verifyToken, eventAPI.createEvent);

router.route("/:eventId").patch(auth.verifyToken, eventAPI.updateEvent);

module.exports = router;
