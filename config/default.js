/**
 * Created by duoyi on 2016/8/15.
 */
var path=require('path');
var filePath='/sinaWeiboPictures/'

module.exports = {
    picturesHostAndPort:'http://127.0.0.1:3000',
    mysql: {
        database: 'sina-weibo',
        username: 'root',
        password: '123456',
        host: '127.0.0.1',
        port: 3306
    },
    filePath:filePath,
    pictureFile:{
        upload:'upload/',
        head:'/head/',
        message:'/message',
        uploadPictureFile:path.join(filePath,'upload'),//上传图片临时存储的路径
        headPictureFile:path.join(filePath,'head'),//头像的图片存放的路径
        messagePictureFile:path.join(filePath,'message')//消息图片存放的路径
    },
    session:{
        secret:'session-store-secret'
    },
    redis:{
        host:'127.0.0.1',
        port:6379,
        db:1,
        opt:{}
    }
}