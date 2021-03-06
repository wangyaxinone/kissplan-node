var Menu = require('../../db/menu/model.js')
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
        this.getUserMenu = this.getUserMenu.bind(this);
    }
    post(req,res,next){
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            body.parentId = body.parentId || '0';
            new Menu(body)
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
            Menu.remove({
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
            for(var key in Menu.schema.obj){
                if(key!=='meta'){
                    newData[key] = body[key]
                }
            }
            Menu.updateOne({
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
                Menu.find(body)
                .sort("sort")
                .exec((err, doc) => {
                    if(err){
                        reject(err);
                    }
                    resolve(recursion(doc));
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
    getUserMenu(req,res,next) {
        var _this = this;
        var pro = new Promise((resolve, reject)=>{
            var body = req.query;
            var newData = [];
            
            

            if(_this.userInfo.roleId && _this.userInfo.roleId.length){
                _this.userInfo.roleId.forEach(roleId => {
                    newData.push(new Promise((resolve, reject)=>{
                        RoleMenu.find({
                            roleId,
                        })
                        .populate('menuId')
                        .sort("sort")
                        .exec((err, doc) => {
                            if(err){
                                reject(err);
                            }
                            
                            resolve(doc[0])
                        }) 
                    }))
                })
            }
            
            Promise.all(newData)
            .then((data)=>{
               
                var menuIds = [];
                if(data && data.length){
                    data.forEach((item)=>{
                        if(item && item._doc.menuId.length){
                            item._doc.menuId.forEach((menu)=>{
                                menuIds.push(menu)
                            })
                        }
                    })
                }
                var hasObj = {};
                var nowData = menuIds.filter((item)=>{
                    if(!hasObj[item._id] && item.alias==='menu'){
                        hasObj[item._id] = true;
                        return true;
                    }else{
                        return false;
                    }
                })
                res.json({
                    code:200,
                    msg:'succ',
                    data:recursion(nowData )
                })
            })
            .catch((err)=>{
                res.json({
                    code:500,
                    msg:err,
                })
            })
        })
        
        
    }
}
module.exports = new Pages()