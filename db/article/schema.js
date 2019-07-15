/**
 * 
 *  */
const mongoose = require('mongoose');
var articleSchema =  new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"文章来源角色不能为空"]
    },
    title:{
        type:String,
        required:[true,"文章标题不能为空"]
    },
    introduction:{
        type:String,
        required:[true,"文章简介不能为空"]
    },
    content:{
        type:String,
        required:[true,"文章内容不能为空"]
    },
    type:{
        type:String,
        required:[true,"文章类型不能为空"]
    },
    redNum:{
        type:Number,
    },
    mdContent:{
        type:String
    },
    self:{
        type:Boolean,
        default:false
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
articleSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = articleSchema;