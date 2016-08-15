/**
 * Created by duoyi on 2016/8/15.
 */
var config=require('config');
var fs=require('fs');
var path=require('path');
var Sequelize=require('sequelize');
var lodash=require('lodash');
var db={};
var sequelize=new Sequelize(config.mysql.database,config.mysql.username,config.mysql.password,{
    dialect:'mysql',
    host:config.mysql.host,
    port:config.mysql.port,
    pool:{
        maxConnections:100,
        minConnections:10
    }
});
fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.')!==0)&&(file!='index.js');
}).forEach(function (file) {
    var model =sequelize.import(path.join(__dirname,file));
    db[model.name]=model;
});
Object.keys(db).forEach(function (modelName) {
    if('associate' in db[modelName]){
        db[modelName].associate(db);
    }
});
module.exports=lodash.extend({sequelize:sequelize,Sequelize:Sequelize},db);