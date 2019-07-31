
var Article = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/Articles',Article.authentication,Article.post);
router.delete('/Articles',Article.authentication,Article.delete);
router.put('/Articles',Article.authentication,Article.put);
router.get('/Articles',Article.get);
router.get('/getNews',Article.getNews);
module.exports = router;
