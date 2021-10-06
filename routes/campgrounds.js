const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsynch');
const AppError = require('../utils/AppError');
const Campground = require('../models/camground');
const {campgroundSchema, reviewsSchema} = require('../schemas.js')

const validateCampground = (req, res, next) => {
    
  
    const {error} = campgroundSchema.validate(req.body)
   
    if(error){ 
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400);
    }
    else{
        next();
    }
}

router.get('/', async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

router.get('/new', (req, res) => {

    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async(req, res) => {

    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async(req, res, next) => {
    
    const campground = await Campground.findById(req.params.id).populate('reviews');
      res.render('campgrounds/show', {campground})

    }
  
))

router.get('/:id/edit', catchAsync( async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
}))

router.put('/:id', validateCampground, catchAsync(async(req, res) => {
    const {id} = req.params;
    
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
  
  
    
    res.render('campgrounds/show', {campground})
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))



module.exports = router;