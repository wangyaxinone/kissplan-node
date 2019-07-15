const mongoose = require('mongoose');
var followSchema = require("./schema.js");
var articleThumbsUp = mongoose.model('articleThumbsUp',followSchema)
module.exports =  articleThumbsUp;