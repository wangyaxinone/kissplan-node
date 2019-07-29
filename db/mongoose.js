const mongoose = require('mongoose');
const Menu = require('./menu/model')
const User = require('./user/model')
const Role = require('./role/model')
const RoleMenu = require('./roleMenu/model')
const MenuDb = require('./menu/db')
mongoose.connect('mongodb://127.0.0.1:27017/kissPlan',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('数据库连接成功')
  Menu.find()
  .exec((err,doc)=>{
    if(err){
      console.log(err)
    }else{
      
    }
    if(!doc || !doc.length ){
      console.log('菜单数据不存在')
      Menu.collection.insert(MenuDb, {}, (err)=>{
        if(err){
          console.log(err)
        }else{
          console.log('导入数据')
        }
      })
    }else{
      console.log('菜单数据已存在')
    }
  })
  
  User.find()
  .exec((err,doc)=>{
    if(err){
      console.log(err)
    }else{
      
    }
    if(!doc || !doc.length ){
      console.log('用户数据不存在')
      new User({"_id":{"$oid":"5d1db5d9e129922edc335a2e"},"meta":{"creatAt":{"$date":{"$numberLong":"1562228185136"}},"updateAt":{"$date":{"$numberLong":"1562228185136"}}},"userName":"wyx","passWord":"$2b$10$NVeklKhGpORBlTOzeYwHS.mTLXF1n82CX6sw0UHXLvrkkigLP8F56","phone":"18210337762","__v":{"$numberInt":"0"},"age":null,"avatarImg":null,"deptId":[{"$oid":"5d394bef875d1941dc81aa65"}],"email":"410694500@qq.com","name":"王亚鑫","openid":null,"remark":null,"roleId":[{"$oid":"5d2c272c8f88544eec029c47"}],"sex":{"$oid":"5d390d74be9b6e3e70c28a4a"},"status":{"$numberInt":"1"},"nickName":null}      )
      .save(()=>{
        if(err){
          console.log(err)
        }else{
          console.log('导入数据')
        }
      })
     
    }else{
      console.log('用户数据已存在')
    }
  })

  Role.find()
  .exec((err,doc)=>{
    if(err){
      console.log(err)
    }else{
      
    }
    if(!doc || !doc.length ){
      console.log('用户数据不存在')
      new Role({"_id":{"$oid":"5d2c272c8f88544eec029c47"},"meta":{"creatAt":{"$date":{"$numberLong":"1563174700812"}},"updateAt":{"$date":{"$numberLong":"1563174700812"}}},"parentId":"0","status":{"$numberInt":"1"},"roleName":"超级管理员","roleAlias":"superAdmin","sort":{"$numberInt":"0"},"__v":{"$numberInt":"0"},"remark":null}      )
      .save(()=>{
        if(err){
          console.log(err)
        }else{
          console.log('导入数据')
        }
      })
     
    }else{
      console.log('用户数据已存在')
    }
  })

  RoleMenu.find()
  .exec((err,doc)=>{
    if(err){
      console.log(err)
    }else{
      
    }
    if(!doc || !doc.length ){
      console.log('用户数据不存在')
      new RoleMenu({"_id":{"$oid":"5d381bec965d352930d428c5"},"meta":{"creatAt":{"$date":{"$numberLong":"1563958252063"}},"updateAt":{"$date":{"$numberLong":"1563958252063"}}},"menuId":[{"$oid":"5d39582a21b4c43654821d12"},{"$oid":"5d39586621b4c43654821d13"},{"$oid":"5d39737fcaecb63d1c1d40d5"},{"$oid":"5d3e663b17d52b51384fbbda"},{"$oid":"5d3eaa8c0442a109949ed50a"},{"$oid":"5d3eb6005fe97f3cd0170abf"},{"$oid":"5d3eb6455fe97f3cd0170ac0"},{"$oid":"5d2c1266fe5e9e3c90510548"},{"$oid":"5d2c12b7fe5e9e3c90510549"},{"$oid":"5d36c58090748d3a74479473"},{"$oid":"5d36c5f490748d3a74479474"},{"$oid":"5d36ccd6d3ed982200edd0a5"},{"$oid":"5d36ced9d3ed982200edd0a6"},{"$oid":"5d2c2b638f88544eec029c4a"},{"$oid":"5d36d49bcd65e6358c7dc577"},{"$oid":"5d3845bfcd35fd47b466f985"},{"$oid":"5d384828b66dda356494fc6c"},{"$oid":"5d390fee219f60363cbcd6d6"},{"$oid":"5d39103b219f60363cbcd6d7"},{"$oid":"5d39106a219f60363cbcd6d8"},{"$oid":"5d2c219d4da5d75f9c212f79"}],"roleId":{"$oid":"5d2c272c8f88544eec029c47"},"__v":{"$numberInt":"0"},"remark":null})
      .save(()=>{
        if(err){
          console.log(err)
        }else{
          console.log('导入数据')
        }
      })
     
    }else{
      console.log('用户数据已存在')
    }
  })
  
});

