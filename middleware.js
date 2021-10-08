module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Ops! you should login to access this page!");

        return res.redirect('/login')
    }
    next();
}