// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

// Very important.
let birds = 666;

// Our port information
const PORT = 5000;

// Calls in express
const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// Routes
app.use(require("./routes/api.js"));

// Initializes the server
app.listen(PORT, () => {
  console.log(`${birds} birds are listening, and this App is running on port ${PORT}.`);
});