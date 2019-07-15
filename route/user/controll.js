var User = require('../../db/user/model.js')
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt') ; 
const baseCom = require('../../base/baseCom.js')
class Account extends baseCom {
    constructor(){
        super();
        this.signIn = this.signIn.bind(this);
    }
    signUp(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            User.findOne({userName :req.body.userName },function(err,data){
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
            let content ={id:userData._id}; // 要生成token的主题信息
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
            User.findOne({userName :req.body.userName },function(err,data){
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
                        let content ={id:data._id}; // 要生成token的主题信息
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
}
module.exports = new Account()