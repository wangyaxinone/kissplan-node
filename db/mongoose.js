const mongoose = require('mongoose');
const Menu = require('./menu/model')
const User = require('./user/model')
const Role = require('./role/model')
const RoleMenu = require('./roleMenu/model')
const MenuDb = require('./menu/db')
mongoose.connect('mongodb://129.28.147.252:27017/kissPlan',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('数据库连接成功')
  
});

