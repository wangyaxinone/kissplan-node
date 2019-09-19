
var User = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/signIn',User.signIn);
router.post('/signInAdmin',User.signInAdmin);
router.post('/signUp',User.signUp);
router.post('/hasUserName',User.hasUserName);
router.post('/hasPhone',User.hasPhone);
router.get('/userHome',User.getCurrentUser,User.userHome);
router.get('/article',User.article);
router.get('/userList',User.authentication,User.roleAuth,User.userList);
router.get('/user',User.authentication,User.get);
router.post('/user',User.authentication,User.post);
router.put('/user',User.authentication,User.put);
router.put('/putUser',User.authentication,User.putUser);
router.delete('/user',User.authentication,User.delete);
router.get('/getAuthor',User.authentication,User.getAuthor);
router.get('/getHotAuthor',User.getHotAuthor);
router.put('/getAuthor',User.authentication,User.updateAuthor);
router.put('/switchEnable',User.authentication,User.switchEnable);
router.get('/signOut',User.authentication,User.signOut);
router.post('/resertPassword',User.authentication,User.resertPassword);
router.post('/resertPasswordAdmin',User.authentication,User.resertPasswordAdmin);

module.exports = router;
