// const express = require("express");
import * as express from "express";

const browseAPI = require("../../controllers/browse.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/museum").get(browseAPI.getBrowseMuseums);

router.route("/event").get(browseAPI.getBrowseEvents);

module.exports = router;
