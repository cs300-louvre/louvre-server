// const express = require("express");
import * as express from "express";

const museumAPI = require("../../controllers/museums.controllers");
const auth = require("../../middlewares/auth");
const eventRouter = require("../event/event.routes");

const router = express.Router();

// Re-route into other resource routers (view events of a museum)
router.use("/:museumId/event", eventRouter);

router.route("/").get(museumAPI.getMuseums);

router.route("/:museumId").get(museumAPI.getMuseumById);

router
  .route("/")
  .post(
    auth.verifyToken,
    auth.checkRoles("manager", "admin"),
    museumAPI.createMuseum
  );

router
  .route("/:museumId")
  .patch(
    auth.verifyToken,
    auth.checkRoles("manager", "admin"),
    museumAPI.updateMuseum
  )
  .delete(
    auth.verifyToken,
    auth.checkRoles("manager", "admin"),
    museumAPI.deleteMuseum
  );

module.exports = router;
