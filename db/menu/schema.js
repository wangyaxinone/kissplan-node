const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
var menuSchema = new mongoose.Schema({
    code:{
        type:String,
        required:[true,"code不能为空"]
    },
    name:{
        type:String,
        required:[true,"name不能为空"]
    },
    name:{
        type:String,
        required:[true,"name不能为空"]
    },
    parentId:{
        type:String,
        default:'0'
    },
    path:{
        type:String,
        required:[true,"path不能为空"]
    },
    sort:{
        type:Number
    },
    source:{
        type:String,
    },//图标
    alias:{
        type:String,
    },
    category:{
        type:Number
    },
    isOpen:{
        type:Number,
        default:0
    },
    status:{
        type:Number,
        default:1
    },
    remark:{
        type:String,
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
menuSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})
menuSchema.statics = {
    
}
module.exports =  menuSchema