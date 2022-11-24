const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandler");

const conncetDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./.env" });

// Connect to database
conncetDB();

// Route files
const users = require("./routes/api/users/users.routes");

// Initialize express
const app = express();

// Body parser
app.use(bodyParser.json());

// Mount routers
app.use("/api/users", users);

// Error handler/catcher middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
});
