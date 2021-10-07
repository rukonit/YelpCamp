const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

const sessionConfig = {secret: 'yelpcamp', 
                        resave: false, 
                        saveUninitialized: true,
                        cookie: {
                            httpOnly: true,
                            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
                            maxAge: 1000 * 60 * 60 * 24 * 7
                        }
                }
app.use(session(sessionConfig))
app.use((req, res, next)=> {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

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





app.use("/campgrounds", campgroundRoutes)

app.use("/campgrounds/:id/reviews", reviewRoutes)

//Review Section



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