
var Menu = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/menu',Menu.post);
router.delete('/menu',Menu.delete);
router.put('/menu',Menu.put);
router.get('/menu',Menu.get);
module.exports = router;
