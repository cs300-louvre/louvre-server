const express = require("express");

const userAPI = require("../../../controllers/users.controllers");

const router = express.Router();

router.route("/register").post(userAPI.register);

module.exports = router;
