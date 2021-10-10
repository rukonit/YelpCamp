const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsynch');
const Campground = require('../models/camground');

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')



router.get('/', async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res) => {

   
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    .populate({path: 'reviews', populate: { path: 'author'}})
    .populate('author');
    if(!campground) {
        req.flash('error', "Camground does not exists!")
        return res.redirect('/campgrounds')
    }
    
      res.render('campgrounds/show', {campground})

    }
  
))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not the author of this blog');
        return res.redirect(`/campgrounds/${id}`)
   }
    res.render('campgrounds/edit', {campground})
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res) => {
    const {id} = req.params;

    
    if (!campground.author.equals(req.user._id)) {
         req.flash('error', 'You are not the authorized to edit this blog');
         return res.redirect(`/campgrounds/${id}`)
    }
    const updatedCampground =  await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
  
  
    
    res.render('campgrounds/show', {updatedCampground})
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', "Successfully deleted the selected campground!");
    res.redirect('/campgrounds')
}))



module.exports = router;