const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();


//load Idea model 
const Idea = require("../model/Ideas");

//ideas route
router.get("/", (req, res) => {
    // finding all items in db
    Idea.find({})
    .sort({date:"desc"})
    .then(ideas => {
        res.render("ideas/ideas", {ideas:ideas})
    })
});


// add form idea route
router.get("/add", (req, res) => {
    res.render("ideas/add");
});


//edit form route
router.get("/:id/edit", (req, res) => {
    Idea.findOne ({
        _id: req.params.id
    })
    .then(idea => {
        res.render("ideas/edit", {
            idea:idea
        });

    })
});


//process form
router.post("/", (req, res) => {
    let error = [];
    if (!req.body.title) {
        error.push({text:"Please add a title"});
    }

    if (!req.body.details) {
        error.push({text:"Please add some details"});
    }
    if (error.length > 0) {
        res.render("ideas/add", {
            error: error,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash("success_msg", "Idea Added");
            res.redirect("/ideas");
        })
    }
});

// edit form process 
router.put("/:id", (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then((idea) => {
        idea.title = req.body.title,
        idea.details = req.body.details

        idea.save()
        .then((idea) => {
            req.flash("success_msg", "Idea Updated");
            res.redirect("/ideas");
        })
    })
});

// delete route
router.delete("/:id", (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash("success_msg", "Idea Removed");
        res.redirect("/ideas");
    })
});

module.exports = router;