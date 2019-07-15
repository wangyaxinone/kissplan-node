var Dictionarie = require('../../db/dictionarie/model.js')
const BaseCom = require('../../base/baseCom.js')
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
            new Dictionarie(body)
            .save((err,data)=>{
                err && reject(err);
                resolve(data);
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
            Dictionarie.remove({
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
            Dictionarie.updateOne({
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
        var pro = new Promise((resolve, reject)=>{
            var body = req.body;
            const pageIndex = body.pageIndex || this.pageIndex,
                pageSize = body.pageSize || this.pageSize;
                Dictionarie.count({parentId:'0'},(err,count)=>{
                    if(err){
                        reject(err);
                    }
                    Dictionarie.find({parentId:'0'})
                    .skip((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .sort({'meta.updateAt': -1})
                    .exec((err, doc) => {
                        if(err){
                            reject(err);
                        }
                        resolve({
                            count:count,
                            pageIndex:pageIndex,
                            pageSize:pageSize,
                            data:doc
                        });
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
    
    
    
}
module.exports = new Pages()