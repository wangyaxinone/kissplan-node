const mongoose = require('mongoose');
var imagesSchema = require("./schema.js");
var image = mongoose.model('image',imagesSchema)
module.exports =  image;