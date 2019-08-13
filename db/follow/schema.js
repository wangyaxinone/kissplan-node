const mongoose = require('mongoose');
 var ObjectId = mongoose.Schema.Types.ObjectId;
var followSchema = new mongoose.Schema({
    
    source:{
        type:ObjectId,
        ref:'User',
        required:[true,"来源不能为空"]
    },
    target:{
        type:ObjectId,
        ref:'User',
        required:[true,"目标不能为空"]
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
followSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})
module.exports =  followSchema