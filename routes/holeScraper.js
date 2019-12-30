const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render('index');
    });

    // Retrieve data from the db
    app.get("/scrape", (req, res) => {

        // Making a request via axios for Clickhole's news page. The page's Response is passed as our promise argument.
        axios.get("https://www.clickhole.com").then(function (response) {
            let scrapeData = [];

            const $ = cheerio.load(response.data);
            $("article.js_post_item").each(function (i, element) {

                let result = {};

                result.title = $(this)
                    .find('h2')
                    .text()
                    .trim();
                result.link = $(this)
                    .children()
                    .last()
                    .find('a')
                    .attr('href');
                result.saved = false;
                scrapeData.push(result);
            });
            // $("div.dv4r5q-3").each(function (i, element) {
            //     result.image = $(this)
            //         .children('img')
            //         .attr('srcset')
            //         .text();
            //         scrapeData.push(result);
            // });

            db.Article.create(scrapeData)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape complete!");
    });
}