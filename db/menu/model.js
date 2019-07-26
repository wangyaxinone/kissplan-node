const mongoose = require('mongoose');
var menuSchema = require("./schema.js")
var menu = mongoose.model('menu',menuSchema);
module.exports =  menu