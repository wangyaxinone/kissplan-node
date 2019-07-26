const mongoose = require('mongoose');
var deptSchema = new mongoose.Schema({
    deptName:{
        type:String,
        required:[true,"部门名称不能为空"],
    },
    parentId:{
        type:String,
        default:'0',
        required:[true,"父级部门不能为空"],
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
deptSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports =  deptSchema