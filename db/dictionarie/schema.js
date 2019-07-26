const mongoose = require('mongoose');
var dictionariesSchema = new mongoose.Schema({
    parentId:{
        type:String,
        default:'0',
        required:[true,"parentId不能为空"]
    },
    code:{
        type:String,
        required:[true,"字典编号不能为空"]
    },
    dictValue:{
        type:String,
        required:[true,"字典名称不能为空"]
    },
    dictKey:{
        type:Number,
    },
    sort:{
        type:Number
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
dictionariesSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})
dictionariesSchema.statics = {
    
}
module.exports = dictionariesSchema;