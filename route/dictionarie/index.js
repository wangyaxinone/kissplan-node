
var User = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/dictionarie',User.post);
router.delete('/dictionarie',User.delete);
router.put('/dictionarie',User.put);
router.get('/dictionarie',User.get);
module.exports = router;
