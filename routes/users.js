const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    // checking for error with custom validators
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
        newUser = new User ({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(() => {
                        req.flash("success_msg", "Registration successful!");
                        res.redirect("/users/login");
                    })
                    .catch((err) => {
                        console.log(err);
                        res.redirect("/users/registration");
                    })
            });
        });
}  
});


module.exports = router;