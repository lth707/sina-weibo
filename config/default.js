/**
 * Created by duoyi on 2016/8/15.
 */
var path=require('path');
var filePath='E:\\sinaWeiboPictures'
module.exports = {
    mysql: {
        database: 'sina-weibo',
        username: 'root',
        password: '123456',
        host: '127.0.0.1',
        port: 3306
    },
    pictureFile:{
        uploadPictureFile:path.join(filePath,'/upload'),//上传图片临时存储的路径
        headPictureFile:path.join(filePath,'/head'),//头像的图片存放的路径
        messagePictureFile:path.join(filePath,'/message')//消息图片存放的路径
    }
}