const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/camground');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

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


app.get('/', (req, res)=> {
    res.redirect('/campgrounds')
})

app.get('/campgrounds', async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', (req, res) => {

    res.render('campgrounds/new')
})

app.post('/campgrounds', async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
      res.render('campgrounds/show', {campground})
})

app.get('/campgrounds/:id/edit', async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    
   
        const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
  
    
    res.render('campgrounds/show', {campground})
})

app.delete('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})




app.listen(3000, ()=> {
    console.log("SERVER IS RUNNING ON PORT 3000");
})