// const express = require("express");
import * as express from "express";

const meAPI = require("../../controllers/me.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(auth.verifyToken, meAPI.getMe);

module.exports = router;
