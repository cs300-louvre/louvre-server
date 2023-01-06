import * as express from "express";

const ratingAPI = require("../../controllers/ticket.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(ratingAPI.getTicketById)
  .post(auth.verifyToken, ratingAPI.checkIn);

module.exports = router;
