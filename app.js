const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();


const port = 3000 || process.env.PORT;

//Map global promise - get rid of warnings
mongoose.Promise = global.Promise;

// setting up mongoose with mongodb
mongoose.connect("mongodb://localhost/VidIdeas")
.then(() => console.log("mongodb connected"))
.catch(err => console.log(err));

//load Idea model 
const Idea = require("./model/Ideas");


//setting up view engine way - one
// with extension hbs
app.engine("hbs", exphbs({extname: "hbs", defaultLayout:"main"}));
app.set("view engine", "hbs");

// setting up view engine way - two 
// with extension handlbars
//app.engine("handlebars", exphbs({defaultLayout:"main"}));
//app.set("view engine", "handlebars")

// Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride("_method"));


// setting up routes
//home route
app.get("/", (req, res) => {
    const title = "Welcome";
    res.render("index", {title:title});
});

// about route
app.get("/about", (req, res) => {
    res.render("about");
});

//ideas route
app.get("/ideas", (req, res) => {
    // finding all items in db
    Idea.find({})
    .sort({date:"desc"})
    .then(ideas => {
        res.render("ideas/ideas", {ideas:ideas})
    })
});


// add form idea route
app.get("/ideas/add", (req, res) => {
    res.render("ideas/add");
});


//edit form route
app.get("/ideas/:id/edit", (req, res) => {
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
app.post("/ideas", (req, res) => {
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
            res.redirect("/ideas");
        })
    }
});


// edit form process 
app.put("/ideas/:id", (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then((idea) => {
        idea.title = req.body.title,
        idea.details = req.body.details

        idea.save()
        .then((idea) => {
            res.redirect("/ideas");
        })
    })
});

// delete route
app.delete("/ideas/:id", (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        res.redirect("/ideas");
    })
});



app.listen(port, () => console.log(`server started on ${port}`));