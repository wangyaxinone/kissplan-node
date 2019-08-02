const express = require('express');
const fs = require('fs')
const path = require('path')
const isProd = process.env.NODE_ENV !== 'development'
const app = express();
var CookIePar = require('cookie-parser'); 
var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-type,blade-auth');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCors);//使用跨域中间件
app.use(CookIePar());
const bodyParser = require('body-parser');
app.use('/images',express.static(path.join(__dirname,'./images')));
app.use(bodyParser.json());
require("./db/mongoose.js")
require("./route/index.js")(app)
const port = /*process.env.PORT ||*/ 3002
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
  