/**
 * Created by duoyi on 2016/8/17.
 */

'use strict'
var db=require('../models');

exports.getUserByEmail=function (email) {
    return db.user.findOne({where:{email:email},raw:true});
}
exports.addUser=function (body) {
    return db.user.create({
        email:body.email.replace(/(^\s*)|(\s*$)/g, ""),
        nickName:body.nickname.replace(/(^\s*)|(\s*$)/g, ""),
        gender:body.gender.replace(/(^\s*)|(\s*$)/g, ""),
        password:body.password.replace(/(^\s*)|(\s*$)/g, ""),
        signature:body.signature.replace(/(^\s*)|(\s*$)/g, ""),
        head:''
    })
}
exports.getUser=function (body) {
    return db.user.findOne({
       where:{email:decodeURIComponent(body.email), password:decodeURIComponent(body.password)},raw:true})
}

exports.getUserByKey=function (key) {
    key=key+'%';
    let selectUserByKey='SELECT * FROM users WHERE email LIKE ? OR nickName LIKE ?';
    return db.sequelize.query(selectUserByKey,{type:'SELECT',raw:true,replacements:[key,key]});
}