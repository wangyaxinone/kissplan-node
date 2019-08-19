var User = require('../../db/user/model.js')
var Role = require('../../db/role/model.js')
var Article = require('../../db/article/model.js')
var Comment = require('../../db/comment/model.js')
var Follow = require('../../db/follow/model.js')
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt') ; 
const baseCom = require('../../base/baseCom.js')
class Account extends baseCom {
    constructor(){
        super();
        this.signUp = this.signUp.bind(this);
        this.signIn = this.signIn.bind(this);
        this.hasUserName = this.hasUserName.bind(this);
        this.hasPhone = this.hasPhone.bind(this);
        this.userList = this.userList.bind(this);
        this.getAuthor = this.getAuthor.bind(this)
        this.signOut = this.signOut.bind(this);
        this.article = this.article.bind(this);
        this.userHome = this.userHome.bind(this);
        this.resertPassword = this.resertPassword.bind(this);
    }
    signOut(req,res,next) {
        this.userInfo = {};
        res.json({
            code:200,
            msg:'succ'
        })
    }
    signUp(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            User.findOne({userName :req.body.userName })
            .exec((err,data)=>{
                if(err){
                    reject(err);
                }
                if(!data){
                    Role.findOne({
                        roleAlias:'author',
                    })
                    .exec((err,roleData)=>{

                        var name=new User({
                            userName:req.body.userName,
                            passWord:req.body.passWord,
                            phone:req.body.phone,
                            avatarImg:'/images/avatarImg.jpg',
                            roleId:[roleData.id]
                        })
                        name.save(function(err){
                            if(err){
                                reject('账号保存失败') 
                            }
                            User.findOne({userName:req.body.userName},function(err,userData){
                                if(err){
                                    reject('账号保存成功，查询失败') 
                                }
                                resolve(userData);
                            })
                        })
                    })
                    
                }else{
                    reject('账号已存在')
                }  
            })
            
        })
        pro.then((userData)=>{
            let content =userData._doc; // 要生成token的主题信息
            let secretOrPrivateKey="suiyi" // 这是加密的key（密钥） 
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60*60*24  // 1小时过期
            });
            res.json({
                code:200,
                msg:'succ',
                data:{
                    ...userData._doc,
                    token
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
    signIn(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            User.findOne({userName :req.body.userName })
            .populate('deptId')
            .populate('roleId')
            .exec((err,data)=>{
                if(!data){
                    return reject('账号密码错误')
                }
                if(err){
                    return reject(err)
                }
                bcrypt.compare(req.body.passWord, data.passWord, function(err, bool) {
                    if(err){
                        return reject(err)
                    }
                    if(bool){

                        let content =data._doc; // 要生成token的主题信息
                        let secretOrPrivateKey="suiyi" // 这是加密的key（密钥） 
                        let token = jwt.sign(content, secretOrPrivateKey, {
                            expiresIn: 60*60*24  // 1小时过期
                        });
                        delete data._doc.passWord
                        data._doc.token = token;
                        return resolve(data._doc)
                    }else{
                        return reject('账号密码错误')
                    }
                    
                });
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
    hasUserName(req,res,next) {
        User.find({
            userName:req.body.userName
        })
        .exec((err,data)=>{
            if(err){
                return res.json({
                    code:500,
                    msg:err,
                    data:{}
                })
            }
            if(data && data.length){
                return res.json({
                    code:500,
                    msg:'账号已存在',
                })
            }else{
                return res.json({
                    code:200,
                    msg:'succ',
                })
            }
        })
    }
    hasPhone(req,res,next) {
        User.find({
            phone:req.body.phone
        })
        .exec((err,data)=>{
            if(err){
                return res.json({
                    code:500,
                    msg:err,
                    data:{}
                })
            }
            if(data && data.length){
                return res.json({
                    code:500,
                    msg:'手机号码已存在',
                })
            }else{
                return res.json({
                    code:200,
                    msg:'succ',
                })
            }
        })
    }
    userHome(req,res,next) {
        var _this = this;
        User.findById({
            _id:req.query._id
        })
        .exec((err,user_doc)=>{
            if(err){
                return res.json({
                    code:500,
                    msg:err,
                    data:{}
                })
            }
            Promise.all([new Promise((resolve,reject)=>{
                Article.find({
                    user:req.query._id
                },'content articleThumbsUp')
                .populate('articleThumbsUp','_id')
                .exec((err,articles)=>{
                    if(err){
                        return reject(err)
                    }
                    var contentLength = 0;
                    var articleThumbsUp = 0;
                    if(articles && articles.length){
                        articles.forEach((articles_doc)=>{
                            contentLength += articles_doc.content.length;
                            articleThumbsUp += articles_doc.articleThumbsUp.length
                        })
                    }
                    user_doc._doc.articleNum = articles.length;
                    user_doc._doc.wordsNum = contentLength;
                    user_doc._doc.beLikeNum = articleThumbsUp;
                    resolve(user_doc)
                })
            }),new Promise((resolve,reject)=>{
                Follow.find({
                    target:req.query._id
                })
                .populate('target','_id')
                .exec((err,follows)=>{
                    if(err){
                        return reject(err)
                    }
                   
                    user_doc._doc.fansNum = follows.length;
                    resolve(follows)
                })
            }),new Promise((resolve,reject)=>{
                Follow.find({
                    source:req.query._id
                })
                .populate('source','_id')
                .exec((err,follows)=>{
                    if(err){
                        return reject(err)
                    }
                   
                    user_doc._doc.followNum = follows.length;
                    resolve(follows)
                })
            }),new Promise((resolve,reject)=>{
                Follow.find({
                    source:_this.userInfo._id,
                    target:req.query._id
                })
                .exec((err,follows)=>{
                    if(err){
                        return reject(err)
                    }
                    if(follows && follows.length){
                        user_doc._doc.isFollow = true;
                    }
                    resolve(follows)
                })
            })])
            .then((data)=>{
                return res.json({
                    code:200,
                    data:user_doc,
                    msg:'succ',
                })
            })
            .catch((err)=>{
                return res.json({
                    code:500,
                    msg:err,
                })
            })
            
        })
        
    }
    article(req,res,next) {
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
                    .sort('sort')
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
    userList(req,res,next) {
        var body = req.query;
        const current = body.current || this.current,
            size = body.size || this.size;
        new Promise((resolve,reject)=>{
            let total = 0;
            let parms = {...body}
            delete parms.current;
            delete parms.size;
            User
            .countDocuments(parms,(err,num)=>{
                if(err){
                    return reject(err)
                }
                total = num;
            })
            .find(parms)
            .populate('deptId','deptName')
            .populate('roleId','roleName')
            .populate('sex','dictValue')
            .skip((current - 1) * size/1)
            .limit(size/1)
            .sort({'meta.updateAt': -1})
            .exec((err,doc)=>{
                if(err){
                    return reject(err)
                }
                if(doc  && doc.length){
                    doc.forEach((item)=>{
                        item._doc.deptName = [];
                        if(item.deptId && item.deptId.length){
                            item.deptId = item.deptId.map((child)=>{
                                item._doc.deptName.push(child.deptName);
                                return child._id;
                            })
                        }
                        item._doc.roleName = [];
                        if(item.roleId && item.roleId.length){
                            item.roleId = item.roleId.map((child)=>{
                                item._doc.roleName.push(child.roleName);
                                return child._id;
                            })
                        }
                        item._doc.roleName = item._doc.roleName && item._doc.roleName.join(',')
                        item._doc.deptName = item._doc.deptName && item._doc.deptName.join(',')
                        item._doc.roleId = item._doc.roleId && item._doc.roleId.join(',')
                        item._doc.deptId = item._doc.deptId && item._doc.deptId.join(',')
                        if(item._doc.sex){

                            item._doc.sexName = item._doc.sex.dictValue
                            item._doc.sex = item._doc.sex._id
                        }
                        
                    })
                }

                resolve({
                    total:total,
                    current:current,
                    size:size,
                    records:doc
                })
            })
        })
        .then((data)=>{
            return res.json({
                code:200,
                data:data,
                msg:'succ',
            })
        })
        .catch((err)=>{
            return res.json({
                code:200,
                msg:err,
            })
        })
    }
    post(req,res,next){
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            body.parentId = body.parentId || '0';
            body.avatarImg = this.baseUrl+'/images/avatarImg.jpg';
            new User(body)
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
    delete(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            var body = req.query;
            User.remove({
                _id:{
                    $in:body.ids
                }
            },(err)=>{
                err && reject(err);
                resolve({});
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
            var newData = {}
            for(var key in User.schema.obj){
                if(key!=='meta' ||  key!=='passWord'){
                    newData[key] = body[key]
                }
            }
            User.updateOne({
                _id:body._id
            },newData,(err,docs)=>{
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
    putUser(req,res,next){
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            var newData = {}
            for(var key in body){
                if(key!=='meta' ||  key!=='passWord'||  key!=='userName'||  key!=='_id'){
                    newData[key] = body[key]
                }
            }
            User.updateOne({
                _id:body._id
            },newData,(err,docs)=>{
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
    resertPassword(req,res,next) {
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            bcrypt.compare( body.oldPassword,_this.userInfo.passWord, function(err, bool) {
                if(err){
                    return reject(err)
                }
                if(bool){
                   
                    var newData = {};
                    const saltRounds = 10 ; 
                    bcrypt.genSalt(saltRounds,function(err, salt){
                        err && reject(err);
                        bcrypt.hash(body.passWord, salt, function(err, hash) {
                            err && reject(err);
                            
                            newData.passWord = hash;
                            User.updateOne({
                                _id:_this.userInfo._id
                            },newData,(err,docs)=>{
                                err && reject(err);
                                resolve(docs);
                            })
                        });
                    })
                   
                }else{
                    return reject('账号密码错误')
                }
                
            });
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
    resertPasswordAdmin(req,res,next) {
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            console.log(body);
            var newData = {};
            const saltRounds = 10 ; 
            if(!body._id){
                reject("_id 为空");
            }
            bcrypt.genSalt(saltRounds,function(err, salt){
                err && reject(err);
                bcrypt.hash('123456', salt, function(err, hash) {
                    err && reject(err);
                    console.log(hash);
                    newData.passWord = hash;
                    User.updateOne({
                        _id:body._id
                    },newData,(err,docs)=>{
                        err && reject(err);
                        resolve(docs);
                    })
                });
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
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
                User.find(body)
                .exec((err, doc) => {
                    if(err){
                        reject(err);
                    }
                    resolve(doc);
                })
        })
        pro.then((userData)=>{
           
            res.json({
                code:200,
                msg:'succ',
                data:userData.length==1?userData[0]:userData
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
    getAuthor(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            var body = req.query;
            const current = body.current || this.current,
            size = body.size || this.size;
            let total = 0;
            let parms = {...body}
            delete parms.current;
            delete parms.size;
            
            Role.findOne({
                roleAlias:'author',
            })
            .exec((err,data)=>{
                if(err){
                    reject(err);
                }
                User
                .countDocuments(parms,(err,num)=>{
                    if(err){
                        return reject(err)
                    }
                    total = num;
                    User.find({
                        roleId:{
                            $elemMatch:{$eq:data._id}
                        },
                        ...parms
                    })
                    .populate('sex','dictValue')
                    .skip((current - 1) * size/1)
                    .limit(size/1)
                    .sort({'meta.updateAt': -1})
                    .exec((err, doc) => {
                        if(err){
                            reject(err);
                        }
                        if(doc  && doc.length){
                            doc.forEach((item)=>{
                                item._doc.deptName = [];
                                if(item.deptId && item.deptId.length){
                                    item.deptId = item.deptId.map((child)=>{
                                        item._doc.deptName.push(child.deptName);
                                        return child._id;
                                    })
                                }
                                item._doc.roleName = [];
                                if(item.roleId && item.roleId.length){
                                    item.roleId = item.roleId.map((child)=>{
                                        item._doc.roleName.push(child.roleName);
                                        return child._id;
                                    })
                                }
                                item._doc.roleName = item._doc.roleName.join(',')
                                item._doc.deptName = item._doc.deptName.join(',')
                                item._doc.roleId = item._doc.roleId.join(',')
                                item._doc.deptId = item._doc.deptId.join(',')
                                if(item._doc.sex){
        
                                    item._doc.sexName = item._doc.sex.dictValue
                                    item._doc.sex = item._doc.sex._id
                                }
                                
                            })
                        }
        
                        resolve({
                            total:total,
                            current:current,
                            size:size,
                            records:doc
                        });
                    })
                })
                
            })
                
        })
        pro.then((userData)=>{
           
            res.json({
                code:200,
                msg:'succ',
                data:userData.length==1?userData:userData
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
    getHotAuthor(req,res,next) {
        
        var pro = new Promise((resolve, reject)=>{
            var body = req.query;
            const current = body.current || this.current,
            size = body.size || this.size;
            let total = 0;
            let parms = {...body}
            delete parms.current;
            delete parms.size;
            Role.findOne({
                roleAlias:'author',
            })
            .exec((err,data)=>{
               
                if(err){
                    reject(err);
                }
                User
                .countDocuments(parms,(err,num)=>{
                    if(err){
                        return reject(err)
                    }
                    total = num;
                    User.find({
                        roleId:{
                            $elemMatch:{$eq:data._id}
                        },
                        ...parms
                    })
                    .populate('sex','dictValue')
                    .skip((current - 1) * size/1)
                    .limit(size/1)
                    .sort({'priority':-1})
                    .exec((err, doc) => {
                        if(err){
                            reject(err);
                        }
                        if(doc  && doc.length){
                            doc.forEach((item)=>{
                                item._doc.deptName = [];
                                if(item.deptId && item.deptId.length){
                                    item.deptId = item.deptId.map((child)=>{
                                        item._doc.deptName.push(child.deptName);
                                        return child._id;
                                    })
                                }
                                item._doc.roleName = [];
                                if(item.roleId && item.roleId.length){
                                    item.roleId = item.roleId.map((child)=>{
                                        item._doc.roleName.push(child.roleName);
                                        return child._id;
                                    })
                                }
                                item._doc.roleName = item._doc.roleName.join(',')
                                item._doc.deptName = item._doc.deptName.join(',')
                                item._doc.roleId = item._doc.roleId.join(',')
                                item._doc.deptId = item._doc.deptId.join(',')
                                if(item._doc.sex){
        
                                    item._doc.sexName = item._doc.sex.dictValue
                                    item._doc.sex = item._doc.sex._id
                                }
                                
                            })
                        }
        
                        resolve({
                            total:total,
                            current:current,
                            size:size,
                            records:doc
                        });
                    })
                })
                
            })
                
        })
        pro.then((userData)=>{
           
            res.json({
                code:200,
                msg:'succ',
                data:userData.length==1?userData:userData
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
    updateAuthor(req,res,next) {

    }
    switchEnable(req,res,next){
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            var newData = {
                status:body.status
            }
            
            User.updateOne({
                _id:body._id
            },newData,(err,docs)=>{
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
}
module.exports = new Account()