if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const User = require("../models/User");
const { requireLogin, requireNOLogin } = require("../utils/utils");
const { catchAsync } = require("../utils/catchAsync");

const router = express.Router();


router.get("/", (req, res) => {
    res.render("home")
})

router.get("/secret", requireLogin, (req, res) => {
    res.render("secret", { userName: req.session.userName })
})

router.get("/register", requireNOLogin, (req, res) => {
    res.render("register");
})

router.post("/register", requireNOLogin, catchAsync(async (req, res) => {
    const { userName, password } = req.body;

    const user = new User({ userName, password }); //mongoose middleware will take care of hash
    await user.save();

    req.session.userId = user._id;
    req.session.userName = user.userName;

    req.flash("success", "Flash - U have registered successfully");
    res.redirect("/secret");
}));

router.get("/login", requireNOLogin, (req, res) => {
    res.render("login")
})

router.post("/login", requireNOLogin, catchAsync(async (req, res) => {

    const { userName, password } = req.body;

    const validUser = await User.findAndValidate(userName, password);
    if (!validUser) {
        req.flash("failure", "Flash - Incorrect username or password");
        return res.redirect("/login");
    }
    req.session.userId = validUser._id;
    req.session.userName = validUser.userName;

    req.flash("success", "Flash - U have logged in successfully");
    res.redirect("/secret");
}));

router.post("/logout", requireLogin, (req, res) => {
    if (req.session.userId) {
        req.session.destroy();
    }

    //req.flash("success", "Flash - U have logged out");
    res.redirect("/");
})


module.exports = router;