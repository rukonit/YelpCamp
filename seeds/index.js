const mongoose = require('mongoose');
const Campground = require('../models/camground');
const cities = require('./cities');
const {places, descriptors} = require('./seedsHelper')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true,
useUnifiedTopology: true
}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("once", () => {
    console.log("Database connected!");
})

const sample = (array) => array[Math.floor(Math.random()* array.length)]

const seedDB = async() => {
    await Campground.deleteMany({})
    for(let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const randPrice = Math.floor(Math.random() * 100) + 10
        const camp =new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: "https://res.cloudinary.com/dfoyezrrn/image/upload/v1634006835/YelpCamp/n4e4xpgn16jsslj6uth0.jpg",
                    name: ""
                },
                {
                    url: "https://res.cloudinary.com/dfoyezrrn/image/upload/v1634006840/YelpCamp/kz01v0ppsnbad1aosinj.jpg",
                    name: ""
                }
            ],
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            price: randPrice,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            author: '615e7cd7f52895204f7227b1'
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});
