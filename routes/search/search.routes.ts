import * as express from "express";

const searchAPI = require("../../controllers/search.controllers");
// const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/").get(searchAPI.search);

module.exports = router;
