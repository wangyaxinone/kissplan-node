var Role = require('../../db/role/model.js')
var RoleMenu = require('../../db/roleMenu/model.js')
const BaseCom = require('../../base/baseCom.js')
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
            body.parentId = body.parentId || '0';
            new Role(body)
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
            var body = req.body;
            Role.remove({
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
            for(var key in Role.schema.obj){
                if(key!=='meta'){
                    newData[key] = body[key]
                }
            }
            Role.updateOne({
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
            var body = req.query;
            let parms = {...body}
            delete parms.current;
            delete parms.size;
                Role.find(parms)
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
    getRoleOne(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            var body = req.query;
                Role.findOne(body)
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
    roleMenuSave(req,res,next){
        var body = req.body;
        body.menuId = body.menuId.split(',')
        new Promise((resolve,reject)=>{
            if(body.roleId){
                RoleMenu.findOne({roleId:body.roleId},(err,doc)=>{
                    if(err){
                        reject(err);
                    }
                    if(doc){
                        var newData = {};
                        for(var key in RoleMenu.schema.obj){
                            if(key!=='meta'){
                                newData[key] = body[key]
                            }
                        }
                        RoleMenu.updateOne({
                            roleId:body.roleId
                        },newData,(err,docs)=>{
                            err && reject(err);
                            resolve(docs);
                        })
                    }else{
                        save();
                    }
                })
            }else{
                save();
            }
            function save(){
                
                new RoleMenu(body)
                .save((err,data)=>{
                    if(err){
                        return reject(err);
                    }
                    return resolve(data);
                })
            }
        })
        .then((data)=>{
            res.json({
                code:200,
                msg:'succ',
                data:data
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
            })
        })
    }
    roleMenuGet(req,res,next){
        var body = req.query;
        new Promise((resolve,reject)=>{
            RoleMenu.findOne(body,(err,doc)=>{
                if(err){
                    reject(err);
                }
                if(doc){
                    resolve(doc._doc && doc._doc.menuId);
                }else{
                    resolve([]);
                }
            })
            
        })
        .then((data)=>{
            res.json({
                code:200,
                msg:'succ',
                data:data
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
            })
        })
    }
}
module.exports = new Pages()