// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');

const axios = require('axios');
const cheerio = require('cheerio');

const db = require('../../models');

const app = express();

const PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local headHolelines database
//const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/headHolelines";
//mongoose.connect(MONGODB_URI);

// Database configuration
const databaseUrl = "scraper";
const collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
const db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Making a request via axios for reddit's "webdev" board. We are sure to use old.reddit due to changes in HTML structure for the new reddit. The page's Response is passed as our promise argument.
//axios.get("https://old.reddit.com/r/webdev").then(function(response) {
  axios.get("https://www.clickhole.com/c/news").then(function(response) {

    // Load the Response into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
  
    // An empty array to save the data that we'll scrape
    var results = [];
  
    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $(".cw4lnv-5").each(function(i, element) {
  
      // Save the text of the element in a "title" variable
      var title = $(element).text();
  
      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element).children().attr("href");
  
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: link
      });
    });
  
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
  });

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
