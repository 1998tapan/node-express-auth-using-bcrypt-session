const express = require("express");
const User = require("../models/User");
const { requireLogin, requireNOLogin } = require("../utils/utils");

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

router.post("/register", requireNOLogin, async (req, res) => {
    const { userName, password } = req.body;

    const user = new User({ userName, password }); //mongoose middleware will take care of hash
    await user.save();

    req.session.userId = user._id;
    req.session.userName = user.userName;

    res.redirect("/secret");
})

router.get("/login", requireNOLogin, (req, res) => {
    res.render("login")
})

router.post("/login", requireNOLogin, async (req, res) => {

    const { userName, password } = req.body;

    const validUser = await User.findAndValidate(userName, password);
    if (!validUser) {
        return res.redirect("/login");
    }
    req.session.userId = validUser._id;
    req.session.userName = validUser.userName;

    res.redirect("/secret");
})

router.post("/logout", requireLogin, (req, res) => {
    if (req.session.userId) {
        req.session.destroy();
    }
    res.redirect("/");
})


module.exports = router;