
var Follow = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/follow',Follow.authentication,Follow.post);
router.delete('/follow',Follow.authentication,Follow.delete);
router.put('/follow',Follow.authentication,Follow.put);
router.get('/follow',Follow.get);
module.exports = router;
