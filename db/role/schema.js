const mongoose = require('mongoose');
var roleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"角色名称不能为空"],
    },
    roleNum:{
        type:Number,
        required:[true,"roleNum不能为空"],
        min:[1,"roleNum最小1"],
        max:[100,"roleNum最小100"]
    },
    parentId:{
        type:String,
        default:0,
        required:[true,"父级角色不能为空"],
    },
    alias:{
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
    var user = this;
    bcrypt.genSalt(saltRounds,function(err, salt){
        if(err){
            return next(err)
        }
        bcrypt.hash(user.passWord, salt, function(err, hash) {
            if(err){
                return next(err)
            }
            user.passWord = hash;
            next();
        });
    })
})

module.exports =  roleSchema