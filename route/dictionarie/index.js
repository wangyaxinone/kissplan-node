
var Dictionarie = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/dictionarie',Dictionarie.authentication,Dictionarie.post);
router.delete('/dictionarie',Dictionarie.authentication,Dictionarie.delete);
router.put('/dictionarie',Dictionarie.authentication,Dictionarie.put);
router.get('/dictionarie',Dictionarie.authentication,Dictionarie.get);
router.get('/getDict',Dictionarie.getDict);
module.exports = router;
