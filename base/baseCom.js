const jwt = require('jsonwebtoken'); 
const Cookies =  require('js-cookie');
class baseCom {
    constructor(){
        this.current = 1;
        this.size = 10;
        this.userInfo = {};
        this.isAdmin = this.isAdmin.bind(this);
        this.authentication = this.authentication.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.baseUrl= 'http://localhost:3002'
    }
    logs(req,res,next) {
        next();
    }
    isAdmin(req,res,next) {
        var _this = this;
        var falg = false;
        if( _this.userInfo.roleId &&  _this.userInfo.roleId.length){
            _this.userInfo.roleId.forEach((item)=>{
                item.roleAlias==='superAdmin' && (falg = true);
            })
        }
        if(falg){
            next();
        }else{
            res.json({
                code:'403',
                data:{},
                msg:'权限不足'
            });
        }
        
    }
    authentication(req,res,next) {
        var _this = this;
        const token = req.headers['blade-auth']|| req.cookies['x-refresh-token']
        if(token){
            let secretOrPrivateKey="suiyi"; // 这是加密的key（密钥） 

            jwt.verify(token, secretOrPrivateKey, function (err, decode) {
                if (err) {  //  时间失效的时候/ 伪造的token    
                    _this.userInfo = {};      
                    return res.json({
                        code:401,
                        msg:'登陆状态失效'
                    })        
                } else {
                    _this.userInfo = decode;
                }
            })

        }else{
            _this.userInfo = {};
            return res.json({
                code:401,
                msg:'登陆状态失效'
            })
        }
        next();
    }
    getCurrentUser(req,res,next) {
        var _this = this;
        const token = req.headers['blade-auth'] || req.cookies['x-access-token']
        if(token){
            let secretOrPrivateKey="suiyi"; // 这是加密的key（密钥） 
            jwt.verify(token, secretOrPrivateKey, function (err, decode) {
                if (err) {  //  时间失效的时候/ 伪造的token   
                    _this.userInfo = {}; 
                    next(); 
                } else {
                    _this.userInfo = decode;
                    next();     
                }
            })

        }else{
            _this.userInfo = {};
            next();     
        }
    }
    roleAuth(req,res,next){
        next()
    }
}
module.exports = baseCom;