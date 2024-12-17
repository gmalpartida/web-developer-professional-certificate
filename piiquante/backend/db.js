const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost/piiquante-db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });