const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

const User = require("./models/User");
const { requireLogin, requireNOLogin } = require("./utils/utils");

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

app.listen("3000", () => {
    console.log("APP IS LISTENING ON PORT 3000");
})

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/secret", requireLogin, (req, res) => {
    res.render("secret", { userName: req.session.userName })
})

app.get("/register", requireNOLogin, (req, res) => {
    res.render("register");
})

app.post("/register", requireNOLogin, async (req, res) => {
    const { userName, password } = req.body;

    const user = new User({ userName, password }); //mongoose middleware will take care of hash
    await user.save();

    req.session.userId = user._id;
    req.session.userName = user.userName;

    res.redirect("/secret");
})

app.get("/login", requireNOLogin, (req, res) => {
    res.render("login")
})

app.post("/login", requireNOLogin, async (req, res) => {

    const { userName, password } = req.body;

    const validUser = await User.findAndValidate(userName, password);
    if (!validUser) {
        return res.redirect("/login");
    }
    req.session.userId = validUser._id;
    req.session.userName = validUser.userName;

    res.redirect("/secret");
})

app.post("/logout", requireLogin, (req, res) => {
    if (req.session.userId) {
        req.session.destroy();
    }
    res.redirect("/");
})