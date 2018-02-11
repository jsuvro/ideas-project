const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

// load idea routes
const ideas = require("./routes/ideas.js");
//load user routes
const users = require("./routes/users");

const port = 3000 || process.env.PORT;

//Map global promise - get rid of warnings
mongoose.Promise = global.Promise;

// setting up mongoose with mongodb
mongoose.connect("mongodb://localhost/VidIdeas")
.then(() => console.log("mongodb connected"))
.catch(err => console.log(err));

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

// express session middleware
app.use(session({
    secret: 'S3Cu43',
    resave: false,
    saveUninitialized: true
  }));

// flash middleware
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

// setting up routes
//home route
app.get("/", (req, res) => {
    const title = "Welcome";
    res.render("index", {title:title});
});

//about route
app.get("/about", (req, res) => {
    res.render("about");
});

// idea routes middleware
app.use("/ideas", ideas);
app.use("/users", users);

app.listen(port, () => console.log(`server started on ${port}`));