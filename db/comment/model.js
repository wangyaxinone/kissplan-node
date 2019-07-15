const mongoose = require('mongoose');
var commentSchema = require("./schema.js")
var comment = mongoose.model('comment',commentSchema);
module.exports =  comment