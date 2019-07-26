const express = require('express');
const fs = require('fs')
const path = require('path')
const isProd = process.env.NODE_ENV !== 'development'
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require("./db/mongoose.js")
require("./route/index.js")(app)
const port = /*process.env.PORT ||*/ 3002
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
  