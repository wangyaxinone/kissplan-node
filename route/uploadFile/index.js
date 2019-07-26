
var uploadFile = require('./controll');
const express = require('express');
const router = express.Router();
var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })
var path = require('path')
var fs = require('fs')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../../images'))
    },
    filename: function (req, file, cb) {
        var fileSplit = file.originalname.split('.');
      cb(null, file.fieldname + '-' + Date.now()+'.'+fileSplit[fileSplit.length-1])
    }
})
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder); 
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = path.join(__dirname,'../../images');
createFolder(uploadFolder);

var upload = multer({ storage: storage }) 
router.post('/uploadFile',upload.single('file'),uploadFile.post);
module.exports = router;
