const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
  app.get("/", function (req, res) {
    db.Article.find({})
      .then((dbArticles) => {
        let hbsObject = { articles: dbArticles };
        res.render("index", hbsObject);
      })
      .catch((err) => res.json(err));
  });

  // Retrieve data from the db
  app.get("/scrape", (req, res) => {
    // Making a request via axios for Clickhole's news page
    axios
      .get("https://www.clickhole.com/category/news/")
      .then(function (response) {
        const $ = cheerio.load(response.data);
        let articleCount = 0;

        $(".post-header h2").each(function (i, element) {
          let result = {};

          if ($(this).find("a").text().includes(":")) {
            result.title = $(this)
              .find("a")
              .text()
              .split(":")[0]
              .trim()
              .toUpperCase();
          } else {
            result.title = $(this)
            .find("a")
            .text()
            .trim()
            .toUpperCase();
          }
          result.link = $(this)
          .find("a")
          .attr("href");
          if ($(this).find("a").text().includes(":")) {
            result.summary = $(this)
            .find("a")
            .text()
            .split(":")[1]
            .trim();
          } else {
            $(this)
            .find("a")
            .text()
            .trim();
          }
          if (result) {
            db.Article.remove().then(() => {
              db.Article.create(result)
                .then((dbArticle) => articleCount++)
                .catch((err) => console.log(err));
            });
          }
        });
        res.status(200).send("Scraped!");
      });
  });

  app.get("/saved", function (req, res) {
    db.savedArticle
      .find({})
      .then(function (dbSavedArticles) {
        let hbsObject = { savedArticles: dbSavedArticles };
        res.render("savedarticles", hbsObject);
      })
      .catch((err) => res.json(err));
  });
};
