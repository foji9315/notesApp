var express = require('express'),
    router = express.Router(),
    Note = require("../models/notes"),
    middleware = require("../lib/middleware");

router.get("/", middleware.isLoggedIn, (req, res) => {
    Note.find().where("author.username").equals(req.user.username).exec((err, notes) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong, try again");
            res.redirect("/");
        }
        else {
            res.render("./notes/show", { notes: notes });
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("./notes/noteForm", { note: new Note({ title: "new" }), disabled: false });
});

router.get("/:id", middleware.isLoggedIn, (req, res) => {
    Note.findById(req.params.id, (err, note) => {
        if (err) {
            req.flash("error", "We had a problem, try again");
            res.redirect("back");
        }
        else {
            res.render("./notes/noteForm", { note: note, disabled: true });
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    let newNote = new Note(req.body.note);
    newNote.author.id = req.user._id;
    newNote.author.username = req.user.username;
    newNote.created = new Date();
    newNote.save((err, noteSaved) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/notes");
        }
    });
});

router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
    Note.findById(req.params.id, (err, noteToEdit) => {
        if (err) {
            req.flash("error", "Note requested not available");
            req.redirect("back");
        }
        else {
            res.render("./notes/noteForm", { note: noteToEdit, disabled: false });
        }
    });
});

router.put("/:id", middleware.isLoggedIn, (req, res) => {
    Note.findById(req.params.id, (err, noteToUpdate) => {
        if (err) {
            req.flash("error", "Note requested not found");
            res.redirect("back");
        }
        else {
            for (let i in req.body.note) noteToUpdate[i] = req.body.note[i];
            noteToUpdate.created = new Date();
            noteToUpdate.save((err, noteSaved) => {
                if (err) {
                    req.flash("error", "We had a problem, try again");
                    res.redirect("back");
                }
                else {
                    req.flash("success", "Note updated successfully");
                    res.redirect("back");
                }
            });
        }
    });
});

router.delete("/:id", middleware.isLoggedIn, (req, res) => {
    Note.findByIdAndDelete(req.params.id, (err, note) => {
        if (err) {
            req.flash("error", "We Couldnt't delete this note (Note not found)");
            res.redirect("back");
        } else {
            req.flash("success", "Note deleted successfully");
            res.redirect("back");
        }
    });
});

module.exports = router;