const mongoose = require('mongoose');
var articleThumbsUpSchema = require("./schema.js");
var articleThumbsUp = mongoose.model('articleThumbsUp',articleThumbsUpSchema)
module.exports =  articleThumbsUp;