const mongoose = require('mongoose');
var roleMenuSchema = require("./schema.js")
var roleMenu = mongoose.model('roleMenu',roleMenuSchema);
module.exports =  roleMenu