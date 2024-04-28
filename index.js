const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const authRouters = require("./routes/auth");



// db configurations using mongoose
mongoose.connect('mongodb://127.0.0.1:27017/authDemo')
    .then(() => {
        console.log("MONGO CONNECTION OPEN !!")
    })
    .catch(err => {
        console.log("ERROR IN OPENING MONGO CONNECTION");
        console.log(err.toString());
    });

const app = express();

// for ejs-mate as new engine for ejs
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//middleware
app.use(express.urlencoded({ extended: true }));
const sessionConfig = {
    secret: "thisisoursecret", resave: false, saveUninitialized: true,
    cookie: {
        // httpOnly: true
        expires: Date.now() + 1000 * 60 * 60 * 24
        , maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use("/", authRouters);

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    next();
})

app.listen("3000", () => {
    console.log("APP IS LISTENING ON PORT 3000");
})
