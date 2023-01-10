import * as express from "express";

const ticketAPI = require("../../controllers/ticket.controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/:ticketId").get(auth.verifyToken, ticketAPI.getTicketById);

router.route("/:id/checkin").put(auth.verifyToken, ticketAPI.checkIn);

module.exports = router;
