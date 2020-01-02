// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

// Require all routes
const apiRoutes = require("./routes/apiRoutes");
const holeScraper = require("./routes/holeScraper");

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Set up Handlebars engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var PORT = process.env.PORT || 3000;

// If deployed, use the deployed database.  Otherwise use the local host

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scienceNews"

// If deployed, use the deployed database. Otherwise use the local headHolelines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/headHoleLines";
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Call routes
apiRoutes(app);
holeScraper(app);

// Start the server
app.listen(PORT, () => console.log("App running on port " + PORT + "!"));