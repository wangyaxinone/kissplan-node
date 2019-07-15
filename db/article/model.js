const mongoose = require('mongoose');
var articleSchema = require("./schema.js");
var article = mongoose.model('article',articleSchema)
module.exports =  article;