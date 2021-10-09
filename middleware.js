module.exports.isLoggedIn = (req, res, next) => {
    console.log("Res user", req.user);
    if (!req.isAuthenticated()) {
        req.flash("error", "Ops! you should login to access this page!");

        return res.redirect('/login')
    }
    next();
}