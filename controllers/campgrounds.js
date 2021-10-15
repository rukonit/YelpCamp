const Campground = require('../models/camground');
const { cloudinary } = require("../claudinary")
const mapbox = require('mapbox');

const geoCoder = new mapbox(process.env.MAPBOX_TOKEN)


module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.newForm = async (req, res) => {

    res.render('campgrounds/new')
}

module.exports.createCampground = async(req, res) => {
    const geoCode = await geoCoder.geocodeForward(req.body.campground.location, (err, data, res)=> {
        return data
       
})


    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoCode.entity.features[0].geometry;
    campground.author = req.user._id;
    campground.images = req.files.map(f =>
        ({url: f.path, filename: f.filename})
        )
    await campground.save();
    console.log(campground);
    req.flash('success', "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    .populate({path: 'reviews', populate: { path: 'author'}})
    .populate('author');
    console.log(campground)
    if(!campground) {
        req.flash('error', "Camground does not exists!")
        return res.redirect('/campgrounds')
    }
    
      res.render('campgrounds/show', {campground})

    }

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;

    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not the author of this blog');
        return res.redirect(`/campgrounds/${id}`)
   }
    res.render('campgrounds/edit', {campground})
}

module.exports.renderUpdateCampground = async(req, res) => {
    const { id } = req.params;

    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
  
    const images = req.files.map(f =>
        ({url: f.path, filename: f.filename})
        )
    campground.images.push(...images)
    await campground.save()
    
    if(req.body.deleteImages) {
    for(let filenae of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filenae)
    }
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    res.render('campgrounds/show', {campground})
}

module.exports.deleteCampground =async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', "Successfully deleted the selected campground!");
    res.redirect('/campgrounds')
}