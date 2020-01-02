const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models/Index');

module.exports = function (app) {

    app.get("/", function (req, res) {
        db.Article.find({})
            .then((dbArticles) => {
                let hbsObject = { articles: dbArticles }
                res.render("index", hbsObject);
            })
            .catch(err => res.json(err))
    });

    // Retrieve data from the db
    app.get("/scrape", (req, res) => {

        // Making a request via axios for Clickhole's news page
        axios.get("https://www.clickhole.com").then(function (response) {
            const $ = cheerio.load(response.data);
            let articleCount = 0;

            $("article.js_post_item").each(function (i, element) {

                let result = {};

                result.title = $(this)
                    .find('h2')
                    .text()
                    .split(':')[0]
                    .trim();
                result.link = $(this)
                    .children()
                    .last()
                    .find('a')
                    .attr('href');
                result.summary = $(this)
                    .find('h2')
                    .text()
                    .split(':')[1];

                if (result) {
                    db.Article.remove()
                        .then(() => {
                            db.Article.create(result)
                                .then(dbArticle => articleCount++)
                                .catch(err => console.log(err));
                        })
                }
            })
            res.status(200).send('Scraped!');
        });
    });

    app.get("/saved", function (req, res) {
        db.savedArticle.find({})
            .then(function (dbSavedArticles) {
                let hbsObject = { savedArticles: dbSavedArticles }
                res.render("savedarticles", hbsObject);
            })
            .catch(err => res.json(err));
    })
}