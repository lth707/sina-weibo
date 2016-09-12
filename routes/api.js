'use strict'
var api=require('../controllers/api');
var multer  = require('multer');
var upload = multer({ dest: '../../../sinaWeiboPictures/upload/' });
let config = require('config'); 
module.exports=function (router) {
  router.get('/signup',api.checkLogin,api.getSignup);
  router.post('/signup',api.checkLogin,api.checkFormData,api.postSignup);
  
  router.get('/login',api.checkLogin,api.getLogin);
  router.post('/login',api.checkLogin,api.postLogin);
  
  router.get('/',api.getIndex);
  
  router.get('/logout',api.logout);
  
  router.get('/create',api.getCreate);
  router.post('/create',api.postCreate);
  router.post('/messageUpload',upload.array('photos'),function (req,res,next) {
    let pictureNames=[];
    req.files.forEach(function (file) {
      pictureNames.push(file.filename);
    });

    res.send({pictures:pictureNames,puloadPath:config.pictureFile.upload});
  });

  router.get('/user/:email',api.getUserInfo);
  
  router.get('/comment/:id',api.getMessageAndComment);
  router.post('/comment',api.checkLogout,api.postComment);
  
  router.post('/good',api.checkLogout,api.postGoodForMessage);

  router.get('/forward',api.getForwardAndMessage);
  router.post('/forward',api.postForwardComment);
}