var user = require("./user/index.js")
var pagesRoute = require("./pagesRoute/index.js")
var dictionarie = require("./dictionarie/index.js")
var menu = require("./menu/index.js")
module.exports = app => {
    app.use('/user',user)
    app.use('/page',pagesRoute)
    app.use('/admin',dictionarie)
    app.use('/admin',menu)
}