const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
    userId: String,         // the MongoDB unique identifier for the user who created the sauce.
    name: String,           // name of the sauce.
    manufacturer: String,   // manufacturer of the sauce.
    description: String,    // description of the sauce.
    mainPepper: String,     // the main pepper ingredient in the sauce.
    imageUrl: String,       // the URL for the picture of the sauce uploaded by the user.
    heat: Number,           // a number between 1 and 10 describing the sauce.
    likes: Number,          // the number of users liking the sauce.
    dislikes: Number,       // the number of users disliking the sauce.
    usersLiked: [String],   // an array of user IDs of those who have liked the sauce.
    usersDisliked: [String], // an array of user IDs of those who have disliked the sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);

