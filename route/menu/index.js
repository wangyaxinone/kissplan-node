
var Menu = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/menu',Menu.authentication,Menu.isAdmin,Menu.post);
router.delete('/menu',Menu.authentication,Menu.isAdmin,Menu.delete);
router.put('/menu',Menu.authentication,Menu.isAdmin,Menu.put);
router.get('/menu',Menu.authentication,Menu.isAdmin,Menu.get);
router.get('/getUserMenu',Menu.authentication,Menu.getUserMenu);
module.exports = router;
