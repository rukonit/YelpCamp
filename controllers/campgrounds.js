const Campground = require('../models/camground');
module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.newForm = async (req, res) => {

    res.render('campgrounds/new')
}

module.exports.createCampground = async(req, res) => {
    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.images = req.files.map(f =>
        ({url: f.path, filename: f.filename})
        )
    await campground.save();
    req.flash('success', "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    .populate({path: 'reviews', populate: { path: 'author'}})
    .populate('author');
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

    const updatedCampground =  await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
  
    // const images = req.files.map(f =>
    //     ({url: f.path, filename: f.filename})
    //     )
    // updatedCampground.images.push(...images)
    // await updatedCampground.save()
    
  
    
    res.render('campgrounds/show', {updatedCampground})
}

module.exports.deleteCampground =async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', "Successfully deleted the selected campground!");
    res.redirect('/campgrounds')
}