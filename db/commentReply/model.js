const mongoose = require('mongoose');
var commentReplySchema = require("./schema.js")
var commentReply = mongoose.model('commentReply',commentReplySchema);
module.exports =  commentReply