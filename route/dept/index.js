
var Dept = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/dept',Dept.authentication,Dept.post);
router.delete('/dept',Dept.authentication,Dept.delete);
router.put('/dept',Dept.authentication,Dept.put);
router.get('/dept',Dept.authentication,Dept.get);
router.get('/getList',Dept.authentication,Dept.getList);
module.exports = router;
