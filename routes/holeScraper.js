const axios = require('axios');
const cheerio = require('cheerio');

function scrapeData() {

    const articleURL = [];
    const articleInfo = [];
    const articlesPendingArr = [];

    // Making a request via axios for Clickhole's news page. The page's Response is passed as the promise argument.
    axios.get("http://www.clickhole.com")
        .then((response) => {
            const $ = cheerio.load(response.data);
            $('article.js_post_item').each((i, element) => {
                const url = $(element)
                    .children()
                    .last()
                    .find('a')
                    .attr('href');

                articleURL.push(url);

                let articlePending = axios.get(url);
                // Push the next pending article up to the array containing all other articles
                articlesPendingArr.push(articlePending);
            })
        })

    // Wait for all promises to be resolved before moving forward
    return Promise.all(articlesPendingArr)
        .then((results) => {
            let i = 0;
            //console.log(results);
            results.forEach((articleHtmlData) => {
                const $ = cherrio.load(articleHtmlData.data);
                let excerpt = $(div.js_expandable - container)
                    .children()
                    .first()
                    .text();
                articleInfo.push({
                    url: articleURL[i],
                    title: $('header').children('h1').text(),
                    excerpt: excerpt,
                    saved: false
                })
                i++;
            })
            //scrapeData returns all the info for the article
            return articleInfo;
        })
};

module.exports = scrapeData;