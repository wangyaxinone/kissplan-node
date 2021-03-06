const mongoose = require('mongoose');
var roleSchema = new mongoose.Schema({
    roleName:{
        type:String,
        required:[true,"角色名称不能为空"],
    },
    parentId:{
        type:String,
        default:'0',
        required:[true,"父级角色不能为空"],
    },
    roleAlias:{
        type:String,
    },
    status:{
        type:Number,
        default:1
    },
    sort:{
        type:Number
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
roleSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports =  roleSchema