var Follow = require('../../db/follow/model.js')
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
    }
    post(req,res,next){
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            body.source = this.userInfo._id;
            Follow
            .find(body)
            .exec((err,doc)=>{
                if(err){
                    return reject(err);
                }  
                if(!doc || !doc.length){
                    new Follow(body)
                    .save((err,data)=>{
                        if(err){
                            return reject(err);
                        }
                        User.findOne({_id:body.target})
                        .exec((err,doc)=>{
                            var newData = {
                                priority:doc._doc.priority +1,
                            };
                            User.updateOne({
                                _id:body.target
                            },newData,(err,docs)=>{
                                err && reject(err);
                                return resolve(docs);
                            })
                        })
                    })
                }else{
                    return reject('已关注');
                }
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
            var body = req.body;
            Follow.remove(body,(err)=>{
                err && reject(err);
                resolve({});
                User.findOne({_id:body.target})
                .exec((err,doc)=>{
                    var newData = {
                        priority:doc._doc.priority -1,
                    };
                    User.updateOne({
                        _id:body.target
                    },newData,(err,docs)=>{
                        err && reject(err);
                        return resolve({});
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
    put(req,res,next){
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            var newData = {}
            for(var key in Follow.schema.obj){
                if(key!=='meta'){
                    newData[key] = body[key]
                }
            }
            Follow.updateOne({
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
    
    get(req,res){
        var pro = new Promise((resolve, reject)=>{
            var body = req.query;
            const current = body.current || this.current,
            size = body.size || this.size;
            let total = 0;
            let parms = {...body}
            delete parms.current;
            delete parms.size;
            Follow
                .countDocuments(parms,(err,num)=>{
                    if(err){
                        reject(err);
                    }
                    total = num;
                    Follow.find(parms)
                        .populate('target')
                        .populate('source')
                        .skip((current - 1) * size/1)
                        .limit(size/1)
                        .sort({'meta.updateAt': -1})
                        .exec((err, doc) => {
                            if(err){
                                reject(err);
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
    
}
module.exports = new Pages()