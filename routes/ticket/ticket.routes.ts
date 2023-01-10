import * as express from "express";

const ticketAPI = require("../../controllers/ticket.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/:ticketId").get(auth.verifyToken, ticketAPI.getTicketById);

router.route("/").post(auth.verifyToken, ticketAPI.checkIn);

module.exports = router;
