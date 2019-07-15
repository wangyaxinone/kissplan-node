const mongoose = require('mongoose');
var userSchema = require("./schema.js")
var User = mongoose.model('User',userSchema);
module.exports =  User