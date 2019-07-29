var Article = require('../../db/Article/model.js')
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
            new Article(body)
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
            var ids = body.ids.split(',')
            Article.remove({
                _id:{
                    $in:ids
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
            for(var key in Article.schema.obj){
                if(key!=='meta'){
                    newData[key] = body[key]
                }
            }
            Article.updateOne({
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
                })
                .find(parms)
                .populate('type','dictValue')
                .skip((current - 1) * size/1)
                .limit(size/1)
                .sort('sort')
                .exec((err, doc) => {
                    if(err){
                        reject(err);
                    }
                    if(doc && doc.length){
                        doc.forEach((item)=>{
                            item._doc.typeName = item._doc.type.dictValue;
                            item._doc.type = item._doc.type._id;
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