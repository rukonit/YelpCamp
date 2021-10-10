const express = require('express');
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsynch');
const AppError = require('../utils/AppError');
const passport = require('passport');

router.get('/register', (req, res)=> {
    res.render('users/register')
})

router.post('/register', catchAsync( async (req, res)=> {
    try {    const {email, username, password} = req.body;
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
  
}))

router.get('/login', (req,res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req,res) => {
    
    req.flash('success', 'Welcome back')
    const returnToUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(returnToUrl)
})

router.get('/logout', (req, res)=> {
    req.logout();
    req.flash('success', "Goodbye, see you later!")
    res.redirect('/campgrounds')
})

module.exports = router;