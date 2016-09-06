var api=require('../controllers/api');
module.exports=function (router) {
  router.get('/signup',api.checkLogin,api.getSignup);
  router.post('/signup',api.checkLogin,api.checkFormData,api.postSignup);
  
  router.get('/login',api.checkLogin,api.getLogin);
  router.post('/login',api.checkLogin,api.postLogin);
  
  router.get('/',api.getIndex);
  
  router.get('/logout',api.logout);
  
  router.get('/create',api.getCreate);
  router.post('/create',api.postCreate);

  router.get('/user/:email',api.getUserInfo);
  
  router.get('/comment/:id',api.checkLogout,api.getMessageAndComment);
  router.post('/comment',api.checkLogout,api.postComment);
  
  router.post('/good',api.checkLogout,api.postGoodForMessage);

  router.get('/forward',api.getForwardAndMessage);
  router.post('/forward',api.postForwardComment);
}