const db = require('../models/Index');
const scrapeData = require('./holeScraper');

// Export the route
module.exports = function (app) {

    app.get("/clearall", function (req, res) {
        db.Article.remove()
            .catch(err => res.json(err));
    })

    app.get("/clearallsaved", function (req, res) {
        db.savedArticle.remove()
            .catch(err => res.json(err));
    })

    app.get("/notes/:id", function (req, res) {
        db.savedArticle.findOne({ _id: req.params.id })
            .populate("note")
            .then(dbArticle => res.send(dbArticle))
            .catch(err => res.json(err));
    });

    app.post("/notes/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.savedArticle.findOneAndUpdate(
                    { _id: req.params.id },
                    { note: dbNote._id },
                    { new: true }
                );
            })
            .then(dbSavedArticle => res.json(dbSavedArticle))
            .catch(err => res.json(err));
    })

    app.get("/savearticle/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .then(function (dbArticle) {
                let saveResult = {};

                saveResult.title = dbArticle.title
                saveResult.link = dbArticle.link
                saveResult.summary = dbArticle.summary

                db.savedArticle.create(saveResult)
                    .then(dbSaved => res.status(200).send("Saved!"))
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    });

    app.get("/deletearticle/:id", function (req, res) {
        db.Article.deleteOne({ _id: req.params.id })
            .then(dbDeletedArticle => console.log('deleted', dbDeletedArticle))
            .catch(err => res.json(err));
    });

    app.get("/deletesavedarticle/:id", function (req, res) {
        db.savedArticle.deleteOne({ _id: req.params.id })
            .then(dbDeletedArticle => console.log('deleted', dbDeletedArticle))
            .catch(err => res.json(err));
    });
}