const User = require('../models/user')

module.exports.renderRegiter = (req, res)=> {
    res.render('users/register')
}

module.exports.register = async (req, res)=> {
   
    try {    
    const {email, username, password} = req.body;
    const user = new User({email, username})
    const newUser = await User.register(user, password);
    req.login(newUser,  err => {
        if(err) {
           
            return next(err);
        }
    })
    req.flash('success', 'Welcome to Yelp Camp!');
    res.redirect('/campgrounds')
}
catch(e) {
    req.flash('error', e.message)
    res.redirect('register')
}
  
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req,res) => {
    
    req.flash('success', 'Welcome back')
    const returnToUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(returnToUrl)
}

module.exports.logoutUser = (req, res)=> {
    req.logout();
    req.flash('success', "Goodbye, see you later!")
    res.redirect('/campgrounds')
}