// const express = require("express");
// const dotenv = require("dotenv");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const errorHandler = require("./middlewares/errorHandler");
// const mongoose = require("mongoose");

import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import "colorts/lib/string";

const conncetDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./.env" });

// Connect to database
mongoose.set("strictQuery", false);
conncetDB();

// Route files
const users = require("./routes/api/users/users.routes");
const museums = require("./routes/api/museums/museums.routes");

// Initialize express
const app = express();

app.use(bodyParser.json()); // Body (json) parser
app.use(cookieParser()); // Cookie parser

// Mount routers
app.use("/api/users", users);
app.use("/api/museums", museums);

// Error handler/catcher middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`⚡️[server]: Server running on port ${port}`.yellow.bold);
});
