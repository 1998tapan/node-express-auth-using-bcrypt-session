module.exports.requireLogin = async (req, res, next) => {
    if (!req.session.userId) {
        req.flash("failure", "You need to login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.requireNOLogin = async (req, res, next) => {
    if (req.session.userId) {
        req.flash("failure", "You are already logged in");
        return res.redirect("/secret");
    }
    next();
}
