
var User = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/getCarousel',User.getCarousel);
module.exports = router;
