// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');

const apiRoutes = require("./routes/apiRoutes");
const holeScraper = require("./routes/holeScraper");

const app = express();

const PORT = process.env.PORT || 3000;

// Set up Morgan as logger, reference 'public' as fallback
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Set up Handlebars engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// If deployed, use the deployed database. Otherwise use the local headHolelines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/headHoleLines";
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

apiRoutes(app);
holeScraper(app);

// Start the server
app.listen(PORT, () => console.log("App running on port " + PORT + "!"));
