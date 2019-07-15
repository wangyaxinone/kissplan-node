/**
 * 
 *  */
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
var imagesSchema =  new mongoose.Schema({
    imgUrl:{
        type:String,
        required:[true,"imgUrl不能为空"]
    },
    imgLink:{
        type:String,
        required:[true,"图片链接不能为空"]
    },
    type:{
        type:ObjectId,
        ref:'dictionarie',
        required:[true,"相册类型不能为空"]
    },
    sort:{
        type:String,
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
imagesSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = imagesSchema;