// const express = require("express");
import * as express from "express";

const userAPI = require("../../../controllers/users.controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.route("/register").post(userAPI.register);

router.route("/login").post(userAPI.login);

router.route("/current").get(auth.verifyToken, userAPI.current);

router.route("/change_password").post(auth.verifyToken, userAPI.changePassword);

router.route("/recover_password").post(userAPI.recoverPassword);

router.route("/recover_password/:resetToken").put(userAPI.resetPassword);

router.route("/change_profile").put(auth.verifyToken, userAPI.changeProfile);

module.exports = router;
