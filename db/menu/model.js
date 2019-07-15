const mongoose = require('mongoose');
var menuSchema = require("./schema.js")
var Menu = mongoose.model('Menu',menuSchema);
module.exports =  Menu