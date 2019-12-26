// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');

const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const apiRoputes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

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

apiRoputes(app);
htmlRoutes(app);

// Retrieve data from the db
app.get("/scrape", (req, res) => {

  // Making a request via axios for Clickhole's news page. The page's Response is passed as our promise argument.
  axios.get("https://www.clickhole.com/c/news").then(function (response) {

    // Load the Response into cheerio and save it to a variable
    const $ = cheerio.load(response.data);

    // With cheerio, find each ".cw4lnv-5" class instance 
    $("article.js_post_item").each(function (i, element) {

      // An empty array to save the data that we'll scrape
      let result = {};

      // Add the title, link, image, saved status, and save them as properties of the result object
      result.title = $(this)
        .find("h2")
        .text()
        .trim();
      result.link = $(this)
        .find(".cw4lnv-1")
        .children("a")
        .attr("href");
      result.saved = false;

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.send("Scrape complete!");
  });
});

// Route for getting all notes from the db
app.get("/notes:id", function (req, res) {
  console.log(req.params.id);
});

// Route for posting all notes from the db
app.post("/notes:id", function (req, res) {
  console.log(req.params.id);
});

// Route for saving all notes in the db
app.get("/saved", function (req, res) {
  console.log(req.params.id);
});

// Route for clearing all saved notes from the db
app.get("/clearallsaved", function (req, res) {
  console.log(req.params.id);
});

// Route for clearing all notes from the db
app.get("/clearall", function (req, res) {
  console.log(req.params.id);
});

// Route for saving a specific Article by id
app.get("/savearticle/:id", function (req, res) {
  console.log(req.params.id);
});

// Route for deleting an Article's associated Note
app.post("/deletearticle/:id", function (req, res) {
  console.log(req.params.id);
});

// Route for deleting all saved articles in the db
app.get("/deletesavedarticle/:id", function (req, res) {
  console.log(req.params.id);
});

// Start the server
app.listen(PORT, () => console.log("App running on port ${PORT}!"));
