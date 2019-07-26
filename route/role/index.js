
var Role = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/role',Role.authentication,Role.post);
router.delete('/role',Role.authentication,Role.delete);
router.put('/role',Role.authentication,Role.put);
router.get('/role',Role.authentication,Role.get);
router.post('/roleMenuSave',Role.authentication,Role.roleMenuSave);
router.get('/roleMenuGet',Role.authentication,Role.roleMenuGet);
module.exports = router;
