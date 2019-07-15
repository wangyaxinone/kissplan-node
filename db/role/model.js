const mongoose = require('mongoose');
var roleSchema = require("./schema.js")
var role = mongoose.model('role',roleSchema);
module.exports =  role