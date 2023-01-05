// const express = require("express");
import * as express from "express";

const eventAPI = require("../../controllers/event.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(auth.verifyTokenChill, eventAPI.getEvents);

router.route("/").post(auth.verifyToken, eventAPI.createEvent);

module.exports = router;
