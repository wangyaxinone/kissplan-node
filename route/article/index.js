
var Article = require('./controll');
const express = require('express');
const router = express.Router();
router.post('/Articles',Article.authentication,Article.post);
router.delete('/Articles',Article.authentication,Article.delete);
router.put('/Articles',Article.authentication,Article.put);
router.get('/Articles',Article.get);
router.get('/getNews',Article.getCurrentUser,Article.getNews);
router.get('/articleThumbsUp',Article.authentication,Article.articleThumbsUp);
router.post('/comment',Article.authentication,Article.comment);
router.get('/comment',Article.getComment);
router.post('/commentReply',Article.authentication,Article.commentReply);
router.get('/commentReply',Article.getCommentReply);
router.get('/commentThumbsUp',Article.authentication,Article.commentThumbsUp);
module.exports = router;
