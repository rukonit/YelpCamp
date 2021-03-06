const Campground = require('../models/camground');
const Review = require('../models/review');
const AppError = require('../utils/AppError'); 

module.exports.createReview = async(req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Successfully created a new review!");
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.deleteReview = async(req, res)=> {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully deleted the selected review!");
    res.redirect(`/campgrounds/${id}`);
}