var Article = require('../../db/article/model.js')
var Comment = require('../../db/comment/model.js')
var CommentReply = require('../../db/commentReply/model.js')
const BaseCom = require('../../base/baseCom.js')
var User = require('../../db/user/model.js')
const {recursion} = require('../../utils/index.js')
class Pages extends BaseCom {
    constructor(){
        super();
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);
        this.put = this.put.bind(this);
        this.get = this.get.bind(this);
        this.getNews = this.getNews.bind(this);
        this.getNewsTwo = this.getNewsTwo.bind(this);
        this.articleThumbsUp = this.articleThumbsUp.bind(this);
        this.comment = this.comment.bind(this);
        this.getComment = this.getComment.bind(this);
        this.commentReply = this.commentReply.bind(this)
        this.commentThumbsUp = this.commentThumbsUp.bind(this)
        this.ArticlesAdmin = this.ArticlesAdmin.bind(this)
    }
    post(req,res,next){
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            body.user = _this.userInfo._id;
            new Article(body)
            .save((err,data)=>{
                if(err){
                    return reject(err);
                }
                User.findOne({_id:body.user})
                .exec((err,doc)=>{
                    var newData = {
                        priority:doc._doc.priority +10,
                    };
                    User.updateOne({
                        _id:body.user
                    },newData,(err,docs)=>{
                        err && reject(err);
                        resolve(docs);
                    })
                })
            })
        })
        pro.then((userData)=>{
            res.json({
                code:200,
                msg:'succ',
                data:{
                    ...userData,
                }
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    delete(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            var body = req.query;
            var ids = body.ids.split(',')
            Article.find({
                _id:{
                    $in:ids
                }
            })
            .exec((err,docs)=>{
                if(docs && docs.length){
                    docs.forEach((article)=>{
                        User.findOne({_id:article.user})
                        .exec((err,user_doc)=>{
                            var newData = {
                                priority:user_doc._doc.priority - 10,
                            };
                            User.updateOne({
                                _id:article.user
                            },newData,(err,docs)=>{
                            })
                        })
                    })
                }
                Article.deleteMany({
                    _id:{
                        $in:ids
                    }
                },(err)=>{
                    err && reject(err);
                    resolve({});
                })
            })
        })
        pro.then((userData)=>{
           
            res.json({
                code:200,
                msg:'succ',
                data:{
                    ...userData,
                }
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    put(req,res,next){
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            console.log(body);
            var newData = {}
            // for(var key in Article.schema.obj){
            //     if(key!=='meta'){
            //         body[key] && (newData[key] = body[key])
            //     }
            // }
            
            Article.updateOne({
                _id:body._id
            },body,(err,docs)=>{
                err && reject(err);
                resolve(docs);
            })
        })
        pro.then((userData)=>{
           
            res.json({
                code:200,
                msg:'succ',
                data:{
                    ...userData,
                }
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    get(req,res,next) {
        var _this = this;
        var body = req.query;
        const current = body.current || this.current,
        size = body.size || this.size;
        var pro = new Promise((resolve, reject)=>{
            let total = 0;
            let parms = {...body}
            delete parms.current;
            delete parms.size;
            parms.self = false;
            parms.status = 1;
                Article
                .countDocuments(parms,(err,num)=>{
                    if(err){
                        return reject(err)
                    }
                    total = num;
                    Article.find(parms)
                    .populate('user','_id userName name avatarImg')
                    .populate('articleThumbsUp','_id userName name avatarImg')
                    .skip((current - 1) * size/1)
                    .limit(size/1)
                    .sort({'priority':-1})
                    .exec((err, doc) => {
                        
                        if(err){
                            reject(err);
                        }
                        var i = 0;
                       
                        if(doc && doc.length){
                            doc.forEach((Article_doc)=>{
                                if(Article_doc.articleThumbsUp && Article_doc.articleThumbsUp.length){
                                    Article_doc._doc.likeNum = Article_doc.articleThumbsUp.length
                                }else{
                                    Article_doc._doc.likeNum = 0;
                                }
                                
                                var imgArr = _this.getimgsrc(Article_doc._doc.content);  // arr 为包含所有img标签的数组
                                if(imgArr && imgArr.length){
                                    Article_doc._doc.thumbnail = imgArr[0]
                                }else{
                                    Article_doc._doc.thumbnail = ''
                                }
                                Article_doc._doc.content = _this.deleteTag(Article_doc._doc.content).slice(0,100);
                                Comment.countDocuments({article:Article_doc._id},(err,num)=>{
                                    Article_doc._doc.commentNum = err?0:num;
                                    i++;
                                    if(i>=doc.length){
                                        resolve({
                                            total:total,
                                            current:current,
                                            size:size,
                                            records:doc
                                        });
                                    }
                                })
                            })
                        }else{
                            resolve({
                                total:total,
                                current:current,
                                size:size,
                                records:[]
                            });
                        }
                        
                    })
                })
        })
        pro.then((userData)=>{
           
            return res.json({
                code:200,
                msg:'succ',
                data:userData
            })
        })
        .catch((err)=>{
            return res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    ArticlesAdmin(req,res,next) {
        var _this = this;
        var body = req.query;
        const current = body.current || this.current,
        size = body.size || this.size;
        var pro = new Promise((resolve, reject)=>{
            let total = 0;
            let parms = {...body}
            delete parms.current;
            delete parms.size;
                Article
                .countDocuments(parms,(err,num)=>{
                    if(err){
                        return reject(err)
                    }
                    total = num;
                    Article.find(parms)
                    .populate('user','_id userName name avatarImg')
                    .populate('articleThumbsUp','_id userName name avatarImg')
                    .skip((current - 1) * size/1)
                    .limit(size/1)
                    .sort({'meta.creatAt':-1})
                    .exec((err, doc) => {
                        if(err){
                            reject(err);
                        }
                        var i = 0;
                       
                        if(doc && doc.length){
                            doc.forEach((Article_doc)=>{
                                if(Article_doc.articleThumbsUp && Article_doc.articleThumbsUp.length){
                                    Article_doc._doc.likeNum = Article_doc.articleThumbsUp.length
                                }else{
                                    Article_doc._doc.likeNum = 0;
                                }
                                
                                var imgArr = _this.getimgsrc(Article_doc._doc.content);  // arr 为包含所有img标签的数组
                                if(imgArr && imgArr.length){
                                    Article_doc._doc.thumbnail = imgArr[0]
                                }else{
                                    Article_doc._doc.thumbnail = ''
                                }
                                Article_doc._doc.content = _this.deleteTag(Article_doc._doc.content).slice(0,100);
                                Comment.countDocuments({article:Article_doc._id},(err,num)=>{
                                    Article_doc._doc.commentNum = err?0:num;
                                    i++;
                                    if(i>=doc.length){
                                        resolve({
                                            total:total,
                                            current:current,
                                            size:size,
                                            records:doc
                                        });
                                    }
                                })
                            })
                        }else{
                            resolve({
                                total:0,
                                current:current,
                                size:size,
                                records:[]
                            });
                        }
                        
                    })
                })
        })
        pro.then((userData)=>{
           
            return res.json({
                code:200,
                msg:'succ',
                data:userData
            })
        })
        .catch((err)=>{
            return res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    getNews(req,res,next) {
        var body = req.query;
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
           
                Article
                .findById(body)
                .populate('user','_id userName name avatarImg')
                .populate('articleThumbsUp','_id userName name avatarImg')
                .exec((err, doc) => {
                    if(err){
                        reject(err);
                    }
                    if(doc){
                        var isCurrentUserLiked = false;
                        if(doc._doc.articleThumbsUp && doc._doc.articleThumbsUp.length){
                            for(var i=0;i<doc._doc.articleThumbsUp.length;i++){
                                var item = doc._doc.articleThumbsUp[i]
                                if(item && item._id == _this.userInfo._id ){
                                    
                                    isCurrentUserLiked = true;
                                    break;
                                }
                            }
                            
                        }
                        doc._doc.isCurrentUserLiked = this.userInfo._id?isCurrentUserLiked:false;
                        var newData = {};
                        if(doc.redNum){
                            newData.redNum = ++doc._doc.redNum;
                            newData.priority = ++doc._doc.priority;
                        }else{
                            doc._doc.redNum = 1;
                            newData.redNum =1;
                        }
                        console.log(newData);
                        Article.updateOne({
                            _id:doc._id
                        },newData,(err,docs)=>{
                            err && reject(err);
                            resolve(doc);
                        })
                    }else{
                        resolve(doc);
                    }
                })
        })
        pro.then((userData)=>{
            if(userData){
                return res.json({
                    code:200,
                    msg:'succ',
                    data:userData
                })
            }else{
                return res.json({
                    code:404,
                    msg:'err',
                })
            }
        })
        .catch((err)=>{
            return res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    getNewsTwo(req,res,next) {
        var body = req.query;
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
           
                Article
                .findById(body)
                .populate('user','_id userName name avatarImg')
                .populate('articleThumbsUp','_id userName name avatarImg')
                .exec((err, doc) => {
                    if(err){
                        reject(err);
                    }
                    if(doc){
                        var isCurrentUserLiked = false;
                        if(doc._doc.articleThumbsUp && doc._doc.articleThumbsUp.length){
                            for(var i=0;i<doc._doc.articleThumbsUp.length;i++){
                                var item = doc._doc.articleThumbsUp[i]
                                if(item && item._id == _this.userInfo._id ){
                                    
                                    isCurrentUserLiked = true;
                                    break;
                                }
                            }
                            
                        }
                        doc._doc.isCurrentUserLiked = this.userInfo._id?isCurrentUserLiked:false;
                        resolve(doc);
                    }else{
                        resolve(doc);
                    }
                })
        })
        pro.then((userData)=>{
            if(userData){
                return res.json({
                    code:200,
                    msg:'succ',
                    data:userData
                })
            }else{
                return res.json({
                    code:404,
                    msg:'err',
                })
            }
        })
        .catch((err)=>{
            return res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    articleThumbsUp(req,res,next) {
        var body = req.query;
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
                Article
                .findById({
                    _id:body._id
                })
                .exec((err, doc) => {
                    if(err){
                        reject(err);
                    }
                    var newData = {
                    }
                    if(doc._doc.articleThumbsUp && doc._doc.articleThumbsUp.length){
                        var index = doc._doc.articleThumbsUp.indexOf(_this.userInfo._id);
                        if(index>-1){
                            doc._doc.articleThumbsUp.splice(index,1)
                            newData.priority = doc._doc.priority-2;
                        }else{
                            newData.priority = doc._doc.priority+2;
                            doc._doc.articleThumbsUp.push(_this.userInfo._id)
                        }
                    }else{
                        doc._doc.articleThumbsUp.push(_this.userInfo._id)
                    }
                   
                    newData.articleThumbsUp = doc._doc.articleThumbsUp;
                    Article.updateOne({
                        _id:body._id
                    },newData,(err,docs)=>{
                        err && reject(err);
                        resolve(doc);
                    })
                })
        })
        pro.then((userData)=>{
            if(userData){
                return res.json({
                    code:200,
                    msg:'succ',
                    data:userData
                })
            }else{
                return res.json({
                    code:404,
                    msg:'err',
                })
            }
        })
        .catch((err)=>{
            return res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    comment(req,res,next){
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            body.from = _this.userInfo._id;
            new Comment(body)
            .save((err,data)=>{
                if(err){
                    return reject(err);
                }
                Article
                .findById({
                    _id:body.article
                })
                .exec((err, doc) => {
                    if(err){
                        reject(err);
                    }
                    var newData = {
                        priority:doc._doc.priority+1
                    }
                    Article.updateOne({
                        _id:body.article
                    },newData,(err,docs)=>{
                        err && reject(err);
                        resolve(docs);
                    })
                })
            })
        })
        pro.then((userData)=>{
            res.json({
                code:200,
                msg:'succ',
                data:{
                    ...userData,
                }
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    getComment(req,res,next){
        var _this = this;
        var body = req.query;
        const current = body.current || this.current,
        size = body.size || this.size;
        const sort = body.sortType=='asc'?1:-1;
        var pro = new Promise((resolve, reject)=>{
            let total = 0;
            let parms = {...body}
            delete parms.current;
            delete parms.size;
            delete parms.sortType;
            Comment
                .countDocuments({
                    article:parms.article
                },(err,num)=>{
                    if(err){
                        return reject(err)
                    }
                    total = num;
                    Comment
                    .find(parms)
                    .populate('from','_id userName name avatarImg')
                    // .populate('article')
                    .skip((current - 1) * size/1)
                    .limit(size/1)
                    .sort({'meta.creatAt':sort})
                    .exec((err, doc) => {
                        if(err){
                            reject(err);
                        }
                        var i = 0;
                    
                        if(doc && doc.length){
                            doc.forEach((Comment_doc)=>{
                                var isCurrentUserLiked = false;
                                if(Comment_doc.commentThumbsUp && Comment_doc.commentThumbsUp.length){
                                    Comment_doc._doc.likeNum = Comment_doc.commentThumbsUp.length;
                                    isCurrentUserLiked = Comment_doc.commentThumbsUp.indexOf(_this.userInfo._id)>-1?true:false
                                }else{
                                    Comment_doc._doc.likeNum = 0;
                                }
                                Comment_doc._doc.isCurrentUserLiked = isCurrentUserLiked;
                                CommentReply.countDocuments({comment:Comment_doc._id},(err,commentReplyNum)=>{

                                    CommentReply.find({comment:Comment_doc._id})
                                    .populate('from','_id userName name avatarImg')
                                    .populate('to','_id userName name avatarImg')
                                    .limit(3)
                                    .exec((err,CommentReplyDoc)=>{
                                        Comment_doc._doc.childCommentTotle = commentReplyNum;
                                        Comment_doc._doc.childCommentList = err?[]:CommentReplyDoc;
                                        i++;
                                        if(i>=doc.length){
                                            resolve({
                                                total:total,
                                                current:current,
                                                size:size,
                                                records:doc
                                            });
                                        }
                                    })
                                })
                            })
                        }else{
                            resolve({
                                total:total,
                                current:current,
                                size:size,
                                records:doc
                            });
                        }
                        
                    })
                })
                
        })
        pro.then((userData)=>{
           
            return res.json({
                code:200,
                msg:'succ',
                data:userData
            })
        })
        .catch((err)=>{
            return res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    commentReply(req,res,next){
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            body.from = _this.userInfo._id;
            new CommentReply(body)
            .save((err,data)=>{
                if(err){
                    return reject(err);
                }
                return resolve(data);
            })
        })
        pro.then((userData)=>{
            res.json({
                code:200,
                msg:'succ',
                data:{
                    ...userData,
                }
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    getCommentReply(req,res,next){
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
            var body = req.query;
            CommentReply.find({comment:body._id})
            .populate('from','_id userName name avatarImg')
            .populate('to','_id userName name avatarImg')
            .skip(body.index/1)
            .limit(3)
            .exec((err,doc)=>{
                if(err){
                    return reject(err)
                }else{
                    resolve(doc)
                }
            })
        })
        pro.then((userData)=>{
            res.json({
                code:200,
                msg:'succ',
                data:userData
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    commentThumbsUp(req,res,next){
        var body = req.query;
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
            Comment
                .findById({
                    _id:body._id
                })
                .exec((err, doc) => {
                    if(err){
                        reject(err);
                    }
                    if(!_this.userInfo._id){
                        return resolve(doc);
                    }
                    if(doc._doc.commentThumbsUp && doc._doc.commentThumbsUp.length){
                        var index = doc._doc.commentThumbsUp.indexOf(_this.userInfo._id);
                        if(index>-1){
                            doc._doc.commentThumbsUp.splice(index,1)
                        }else{
                            doc._doc.commentThumbsUp.push(_this.userInfo._id)
                        }
                    }else{
                        doc._doc.commentThumbsUp.push(_this.userInfo._id)
                    }
                    var newData = {
                        commentThumbsUp:doc._doc.commentThumbsUp
                    }
                    Comment.updateOne({
                        _id:body._id
                    },newData,(err,docs)=>{
                        err && reject(err);
                        resolve(doc);
                    })
                })
        })
        pro.then((userData)=>{
            if(userData){
                return res.json({
                    code:200,
                    msg:'succ',
                    data:userData
                })
            }else{
                return res.json({
                    code:404,
                    msg:'err',
                })
            }
        })
        .catch((err)=>{
            return res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
    
}
module.exports = new Pages()