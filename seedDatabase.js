const mongoose = require('mongoose');
const Tour = require('./models/Tour');
require('dotenv').config();

const tours = [
  {
    name: "Mountain Biking Adventure",
    description: "Experience thrilling mountain biking trails in the Rockies.",
    date: new Date("2023-07-15"),
    price: 199.99,
    image: "https://example.com/mountain-biking.jpg"
  },
  {
    name: "Coastal Hiking Expedition",
    description: "Explore breathtaking coastal trails along the Pacific.",
    date: new Date("2023-08-01"),
    price: 149.99,
    image: "https://example.com/coastal-hiking.jpg"
  },
  {
    name: "Urban Cycling Tour",
    description: "Discover hidden gems in the city with our guided cycling tour.",
    date: new Date("2023-06-30"),
    price: 79.99,
    image: "https://example.com/urban-cycling.jpg"
  }
];

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      await Tour.deleteMany({});
      console.log('Cleared existing tours');

      const createdTours = await Tour.create(tours);
      console.log(`Created ${createdTours.length} tours`);
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));