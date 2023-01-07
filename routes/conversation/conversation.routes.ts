// const express = require("express");
import * as express from "express";

const conversationAPI = require("../../controllers/conversation.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(auth.verifyToken, conversationAPI.getConversationIdByUserId);

module.exports = router;
