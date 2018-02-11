const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// load schema
const User = require("../model/users");

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.get("/registration", (req, res) => {
    res.render("users/registration");
});

router.post("/registration", (req, res) => {
    let error = [];

    if (req.body.password.length < 4) {
        error.push({text:"password is less than 5 letters"});
    }

    if (req.body.password !== req.body.password2) {
        error.push({text:"passwords do not match"});
    }

    if (error.length > 0) {
        res.render("users/registration", {
            error:error,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        res.send("success");
    }
});


module.exports = router;