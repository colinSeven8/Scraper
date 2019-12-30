const db = require('../models');
const scrapeData = require('./holeScraper');

// Export the route
module.exports = function (app) {

    app.get("/api/articles", function (req, res) {
        scrapeData().then((results) => {
            results.forEach(article => {
                db.Article.create(article)
                    .then((addedArticle) => {
                    })
                    .catch((err) =>  console.log(err));
            });
            res.status(200).send("sent");
        })
    })

    app.post("/api/save/article", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.body.id }, { saved: true }).then((savedArticle) => {
            // console.log(savedArticle)
        });
    })

    app.post("/api/addNotes/:id", function (req, res) {
        const articleId = req.params.id;
        const text = req.body;
        console.log(text);

        db.Note.create(text)
            .then((note) => {
                return db.Article.findOneAndUpdate({ _id: articleId }, {$push: { note: note._id }}, { new: true });
            })
            .then(result => res.status(200).end())
            .catch(err => {
                console.log(err)
                res.status(400).end()
            })
    })

    app.get("/api/getNotes/:id", function (req, res) {
        const articleId = req.params.id;
            db.Article.findOne({ _id: articleId })
                .populate("note")
                .exec((err, noteData) => {
                    console.log(noteData.note)
                    res.status(200).json(noteData.note)
                })
    })

    app.delete("/api/delete/:noteId", function(req, res) {
        db.Note.findOne({_id: req.params.noteId}).then(note => {
            note.remove()
            .then(success => console.log(success))
            .catch(err => console.log(err))
        })
    })

    app.get("/api/saved/articles", function (req, res) {
        db.Article.find({ saved: true }).then(results => {
            res.render("savedArticles", {
                articles: results
            })
        })
    })
}