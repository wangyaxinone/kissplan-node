const mongoose = require('mongoose');
var commentThumbsUpSchema = require("./schema.js")
var commentThumbsUp = mongoose.model('commentThumbsUp',commentThumbsUpSchema);
module.exports =  commentThumbsUp