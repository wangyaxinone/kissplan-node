const mongoose = require('mongoose');
 var ObjectId = mongoose.Schema.Types.ObjectId;
var articleThumbsUpSchema = new mongoose.Schema({
    article:{
        type:ObjectId,
        ref:'article',
        required:[true,"文章不能为空"]
    },
    from:{
        type:ObjectId,
        ref:'user',
        required:[true,"来源不能为空"]
    },
    meta:{
        creatAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})
articleThumbsUpSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})
module.exports =  articleThumbsUpSchema