const baseCom = require('../../base/baseCom.js')
const qiniu = require('qiniu')
var fs  = require('fs')
const axios = require('axios')
class Account extends baseCom {
    constructor(){
        super();
        this.token = null;
        this.post = this.post.bind(this)
        this.getToken = this.getToken.bind(this);
        this.upToQiniu = this.upToQiniu.bind(this);
        this.getList = this.getList.bind(this);
    }
    getToken(){
        const accessKey = 'QwZwiPUM83Hzb5OoP6lYOvRc74ByhIl7K5flzRVs' // 你的七牛的accessKey
        const secretKey = '4lLYXz3WwNgB5ICvKzj_nXPJQiX5Aj0qkCEWZ6C8'// 你的七牛的secretKey
        const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        const options = {
            scope: 'kissplan', // 你的七牛存储对象
        }
        const putPolicy = new qiniu.rs.PutPolicy(options)
        const uploadToken = putPolicy.uploadToken(mac)
        this.token = uploadToken;
    }
    upToQiniu (filePath, key) {
        var uploadToken 
        var _this = this;
        if(_this.token){
            uploadToken = _this.token
        }else{
            _this.getToken();
            uploadToken = _this.token
        }
        const config = new qiniu.conf.Config()
        // 空间对应的机房
        config.zone = qiniu.zone.Zone_z1
        const localFile = filePath
        const formUploader = new qiniu.form_up.FormUploader(config)
        const putExtra = new qiniu.form_up.PutExtra()
        // 文件上传
        return new Promise((resolved, reject) => {
            formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
                console.log(respInfo.statusCode);
                if (respErr) {
                    reject(respInfo)
                }
                if (respInfo.statusCode == 200) {
                    resolved(respBody)
                } else if(respInfo.statusCode == 401){
                    _this.getToken();
                    _this.upToQiniu(filePath, key)
                    resolved(respBody)
                }else{
                    resolved(respBody)
                }
            })
        })
        
    }
    post(req,res,next){
        var file = req.file;
        this.upToQiniu(file.path,file.filename)
        .then((userData)=>{
            fs.unlink(file.path, (err) => {
                if (err) throw err;
                console.log('已成功删除 '+file.path);
            });
              
            res.json({
                code:200,
                msg:'succ',
                data:{
                    url:`http://images.jsercode.com/${userData.key}`,
                }
            })
        })
        .catch((err)=>{
            fs.unlink(file.path, (err) => {
                if (err) throw err;
                console.log('已成功删除 '+file.path);
            });
            res.json({
                code:500,
                msg:err,
                data:{}
            })
        })
       
        
    }
    getList(req,res,next){
        var _this = this;
        axios({
            url:'https://rsf.qbox.me/list',
            method:'get',
            headers: {'Authorization': this.token},
        })
        .then((data)=>{
            console.log(data)
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
            res.json(err)
        })
    }
    
}
module.exports = new Account()