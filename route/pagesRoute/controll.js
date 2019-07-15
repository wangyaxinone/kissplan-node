var User = require('../../db/user/model.js')
const BaseCom = require('../../base/baseCom.js')
class Pages extends BaseCom {
    constructor(){
        super();
        this.getCarousel = this.getCarousel.bind(this);
    }
    getCarousel(req,res,next) {
        var pro = new Promise((resolve, reject)=>{
            User.findOne({userName :req.body.userName },function(err,data){
                if(err){
                    reject(err);
                }
                if(!data){
                    var name=new User({
                        userName:req.body.userName,
                        passWord:req.body.passWord,
                        phone:req.body.phone,
                    })
                    name.save(function(err){
                        if(err){
                            reject('账号保存失败') 
                        }
                        User.findOne({userName:req.body.userName},function(err,userData){
                            if(err){
                                reject('账号保存成功，查询失败') 
                            }
                            resolve(userData);
                        })
                    })
                    
                }else{
                    reject('账号已存在')
                }
            })
        })
        pro.then((userData)=>{
            let content ={id:userData._id}; // 要生成token的主题信息
            let secretOrPrivateKey="suiyi" // 这是加密的key（密钥） 
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60*60*24  // 1小时过期
            });
            res.json({
                code:200,
                msg:'succ',
                data:{
                    ...userData._doc,
                    token
                }
            })
        })
        .catch((err)=>{
            res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
    }
   
}
module.exports = new Pages()