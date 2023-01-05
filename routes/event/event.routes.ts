// const express = require("express");
import * as express from "express";

const eventAPI = require("../../controllers/event.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(eventAPI.getMuseums);

module.exports = router;
