const mongoose = require('mongoose');
var deptSchema = require("./schema.js")
var dept = mongoose.model('dept',deptSchema);
module.exports =  dept