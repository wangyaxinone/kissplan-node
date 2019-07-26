const mongoose = require('mongoose');
const bcrypt = require('bcrypt') ;  
const jwt = require('jsonwebtoken'); 
const saltRounds = 10 ; 
const ObjectId = mongoose.Schema.Types.ObjectId;
var userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,"用户名不能为空"]
    },
    passWord:{
        type:String,
        required:[true,"密码不能为空"]
    },
    name:{
        type:String
    },
    status:{
        type:Number,
        default:1
    },
    roleId:[
        {
            type:ObjectId,
            ref:'role'
        }
    ],
    deptId:[
        {
            type:ObjectId,
            ref:'dept'
        }
    ],
    sex:{
        type:ObjectId,
        ref:'dictionarie'
    },
    phone:{
        type:String,
        required:[true,"手机号不能为空"],
        validate:{
            validator: function(data) {
                return /^1[3456789]\d{9}$/.test(data);
            },
            message: '{VALUE} 手机号码不正确!'
        }
    },
    email:{
        type:String,
        required:[true,"邮箱不能为空"],
        validate:{
            validator: function(data) {
                return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(data);
            },
            message: '{VALUE} 邮箱格式不正确!'
        }
    },
    age:{
        type:Number,
        min:[18,"未成年"]
    },
    avatarImg:{
        type:String
    },
    remark:{
        type:String,
        minlength:[10,"minlength >=10"],
        maxlength:[200,"maxlength >=200"],
    },
    openid:String,
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
userSchema.pre('save',function(next){
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
userSchema.statics = {
    findByName(userName ,cb){
        return this.find({userName :userName })
        .sort("meta.updateAt")
        .exec(cb)
    },
    
    signIn({userName,passWord},cb){
        this.findOne({userName :userName },function(err,data){
            if(!data){
                return  cb('该用户不存在', false)
            }
            if(err){
                return cb(err)
            }
            bcrypt.compare(passWord, data.passWord, function(err, res) {
                let content ={id:data._id}; // 要生成token的主题信息
                let secretOrPrivateKey="suiyi" // 这是加密的key（密钥） 
                let token = jwt.sign(content, secretOrPrivateKey, {
                    expiresIn: 60*60*1  // 1小时过期
                });
                delete data._doc.passWord
                data._doc.token = token;
                return  cb(err, res ,data._doc)
            });
            
        })
    }
}
module.exports =  userSchema