// const express = require("express");
import * as express from "express";

const messageAPI = require("../../controllers/message.controllers");
const auth = require("../../middlewares/auth");
const eventRouter = require("../event/event.routes");

const router = express.Router();

// Re-route into other resource routers (view events of a museum)
router.use("/:museumId/event", eventRouter);

module.exports = router;
