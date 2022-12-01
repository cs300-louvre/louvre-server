const express = require("express");

const userAPI = require("../../../controllers/users.controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.route("/register").post(userAPI.register);

router.route("/login").post(userAPI.login);

router.route("/current").get(auth.verifyToken, userAPI.current);

module.exports = router;
