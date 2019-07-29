
var Image = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/images',Image.authentication,Image.post);
router.delete('/images',Image.authentication,Image.delete);
router.put('/images',Image.authentication,Image.put);
router.get('/images',Image.authentication,Image.get);
router.get('/getCarousel',Image.getCarousel);
module.exports = router;
