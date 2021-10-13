const {campgroundSchema} = require('./schemas.js');
const AppError = require('./utils/AppError');
const Campground = require('./models/camground');
const Review = require('./models/review')
const {reviewsSchema} = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {

    console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Ops! you should login to access this page!");

        return res.redirect('/login')
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    
  
    const {error} = campgroundSchema.validate(req.body)
   
    if(error){ 
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to edit this page');
        return res.redirect(`/campgrounds`)
   }
   next();
}
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    console.log(review)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'No such review!');
        return res.redirect(`/campgrounds`)
   }
   next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewsSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message.join(","))
        throw new AppError(msg, 400)
    }
    else {
        next();
    }

}