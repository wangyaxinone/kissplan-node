const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
var roleMenuSchema = new mongoose.Schema({
    roleId:{
        type:ObjectId,
        ref:'role',
    },
    menuId:[
        {
            type:ObjectId,
            ref:'menu',  
        }
    ],
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
roleMenuSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports =  roleMenuSchema