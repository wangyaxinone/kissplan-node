const mongoose = require('mongoose');
 var ObjectId = mongoose.Schema.Types.ObjectId;
var commentReplySchema = new mongoose.Schema({
    comment:{
        type:ObjectId,
        ref:'comment',
        required:[true,"评论源头不能为空"]
    },
    from:{
        type:ObjectId,
        ref:'user',
        required:[true,"来源不能为空"]
    },
    to:{
        type:ObjectId,
        ref:'user',
        required:[true,"目标不能为空"]
    },
    comment:{
        type:String,
        maxlength:200,
        minlength:10,
        required:[true,"内容不能为空"]
    },
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
commentReplySchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports =  commentReplySchema