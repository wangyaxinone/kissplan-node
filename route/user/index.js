
var User = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/signIn',User.signIn);
router.post('/signUp',User.signUp);
router.post('/hasUserName',User.hasUserName);
router.post('/hasPhone',User.hasPhone);
router.get('/userList',User.authentication,User.roleAuth,User.userList);
router.get('/user',User.authentication,User.get);
router.post('/user',User.authentication,User.post);
router.put('/user',User.authentication,User.put);
router.delete('/user',User.authentication,User.delete);
router.get('/getAuthor',User.authentication,User.getAuthor);
module.exports = router;
