import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import "colorts/lib/string";
import morgan from "morgan";
import cors from "cors";
import { appendFile } from "fs";

const conncetDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./.env" });

// Connect to database
mongoose.set("strictQuery", false);
conncetDB();

// Route files
const users = require("./routes/users/users.routes");
const museums = require("./routes/museums/museums.routes");
const browse = require("./routes/browse/browse.routes");
const me = require("./routes/me/me.routes");
const event = require("./routes/event/event.routes");
const rating = require("./routes/rating/rating.routes");
const ticket = require("./routes/ticket/ticket.routes");


// Initialize express
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Body (json) parser
app.use(cookieParser()); // Cookie parser
app.use(morgan("dev")); // Logger

// Mount routers
app.get("/", (req, res) => {
  res.status(200).send({ message: "Server is online!" });
});
app.use("/user", users);
app.use("/museum", museums);
app.use("/browse", browse);
app.use("/me", me);
app.use("/event", event);
app.use("/rating", rating);
app.use("/ticket", event);


// Error handler/catcher middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`⚡️ [Server]: Server running on port ${port}`.yellow.bold);
});
