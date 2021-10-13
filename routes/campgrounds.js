const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsynch');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const multer = require('multer');

const {storage} = require('../claudinary')
const upload = multer({storage})



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('campground[image]'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, catchAsync(campgrounds.newForm))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('campground[image]'), validateCampground, catchAsync(campgrounds.renderUpdateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))

router.route('/:id/edit').get(isLoggedIn, isAuthor, campgrounds.renderEditForm);




module.exports = router;