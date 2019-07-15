const mongoose = require('mongoose');
var dictionariesSchema = require("./schema.js")

var dictionarie = mongoose.model('dictionarie',dictionariesSchema);
module.exports =  dictionarie