const express = require("express");

const museumAPI = require("../../../controllers/museums.controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.route("/").get(museumAPI.getMuseums);

router.route("/").post(auth.verifyToken, museumAPI.createMuseum);

module.exports = router;
