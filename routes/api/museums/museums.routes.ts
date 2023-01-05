// const express = require("express");
import * as express from "express";

const museumAPI = require("../../../controllers/museums.controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.route("/").get(museumAPI.getMuseums);

router.route("/:id").get(museumAPI.getMuseum);

router.route("/").post(auth.verifyToken, museumAPI.createMuseum);

router.route("/:id").put(auth.verifyToken, museumAPI.updateMuseum);

module.exports = router;
