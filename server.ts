const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");

const conncetDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./.env" });

// Connect to database
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
  console.log(`Server running on port ${port}`.yellow.bold);
});
