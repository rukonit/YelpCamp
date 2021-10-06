const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/camground');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsynch');
const {campgroundSchema, reviewsSchema} = require('./schemas.js')
const Review = require('./models/review')
const campgroundRoutes = require('./routes/campgrounds')

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.engine('ejs', ejsMate);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true,
useUnifiedTopology: true
}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("once", () => {
    console.log("Database connected!");
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



const validateReview = (req, res, next) => {
    const {error} = reviewsSchema.validate(req.body)

    if(error){
        const msg = error.details.map(el => el.message.join(","))
        throw new AppError(msg, 400)
    }
    else {
        next();
    }

}

app.use("/campgrounds", campgroundRoutes)

//Review Section

app.post('/campgrounds/:id/reviews', validateReview, catchAsync (async(req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res)=> {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

//Middlewares

app.all('*', (req, res, next) => {
    return next(new AppError("Ops! Page not found", 404))
})

app.use((err, req, res, next) => {
    const {status = 500 , message = 'Something went wrong'} = err;
    console.log(err);
    res.status(status).render('error', {message})
})

app.listen(3000, ()=> {
    console.log("SERVER IS RUNNING ON PORT 3000");
})