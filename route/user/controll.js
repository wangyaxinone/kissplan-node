var User = require('../../db/user/model.js')
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
    }
    signUp(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            User.findOne({userName :req.body.userName })
            .populate('deptId')
            .populate('roleId')
            .exec((err,data)=>{
                if(err){
                    reject(err);
                }
                if(!data){
                    var name=new User({
                        userName:req.body.userName,
                        passWord:req.body.passWord,
                        phone:req.body.phone,
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
                if(key!=='meta'){
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
}
module.exports = new Account()