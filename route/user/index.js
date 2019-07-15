
var User = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/signIn',User.signIn);
router.post('/signUp',User.signUp);
router.post('/hasUserName',User.hasUserName);
router.post('/hasPhone',User.hasPhone);
module.exports = router;
