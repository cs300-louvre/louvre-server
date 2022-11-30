const express = require("express");

const userAPI = require("../../../controllers/users.controllers");

const router = express.Router();

router.route("/register").post(userAPI.register);

router.route("/login").post(userAPI.login);

router.route("/change_password").post(userAPI.changePassword);

module.exports = router;
