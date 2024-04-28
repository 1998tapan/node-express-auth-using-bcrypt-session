module.exports.requireLogin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }
    next();
}

module.exports.requireNOLogin = async (req, res, next) => {
    if (req.session.userId) {
        return res.redirect("/secret");
    }
    next();
}
