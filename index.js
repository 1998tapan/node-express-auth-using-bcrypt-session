const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");

const authRouters = require("./routes/auth");

// db configurations using mongoose
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/authDemo';

mongoose.connect(DB_URL)
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
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
    mongoUrl: DB_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.STORE_SECRET
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionSecret = process.env.SESSION_SECRET || "thisisoursecret";
const sessionConfig = {
    secret: sessionSecret, resave: false, saveUninitialized: true,
    cookie: {
        // httpOnly: true
        expires: Date.now() + 1000 * 60 * 60 * 24
        , maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    res.locals.userName = req.session.userName;
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");

    next();
})

app.use("/", authRouters);

app.listen("3000", () => {
    console.log("APP IS LISTENING ON PORT 3000");
})
