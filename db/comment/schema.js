const mongoose = require('mongoose');
 var ObjectId = mongoose.Schema.Types.ObjectId;
var commentSchema = new mongoose.Schema({
    article:{
        type:ObjectId,
        ref:'article',
        required:[true,"文章不能为空"]
    },
    from:{
        type:ObjectId,
        ref:'User',
        required:[true,"来源不能为空"]
    },
    comment:{
        type:String,
        maxlength:200,
        minlength:10,
        required:[true,"内容不能为空"]
    },
    commentThumbsUp:[
        {
            type:ObjectId,
            ref:'User',
        }
    ],
    status:{
        type:Number,
        default:1
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
commentSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})
commentSchema.statics = {
    findByName(userName ,cb){
        return this.find({userName :userName })
        .sort("meta.updateAt")
        .exec(cb)
    },
    
}
module.exports =  commentSchema