// const express = require("express");
import * as express from "express";

const messageAPI = require("../../controllers/message.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(auth.verifyToken, messageAPI.getMessagesByConversationId);

router.route("/").post(auth.verifyToken, messageAPI.createMessage);

module.exports = router;
