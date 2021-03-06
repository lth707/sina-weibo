/**
 * Created by duoyi on 2016/8/18.
 */
var db=require('../models');
exports.createMessage=function (message) {
   return db.message.create(message);
}
exports.getMessage=function(option){
   if(option._id){
      return db.message.findOne({where:{_id:option._id}});
   }else if(option.tab&&option.tab!='全部'){
      return db.message.findAll({where:{tab:option.tab},order:[['creatAt','DESC']],offset:option.offset,limit:option.limit,raw:true})
   }else{
      return db.message.findAll({order:[['creatAt','DESC']],raw:true,offset:option.offset,limit:option.limit})
   }
}
exports.getMessageCount=function (option) {
   if(option.tab&&option.tab!='全部'){
      return db.message.count({where:{tab:option.tab}});
   }else{
      return db.message.count();
   }
}

exports.upDateMessage=function (values,options) {
   return db.message.update(values,options);
}
exports.getPersonMessageCount=function (option) {
   if(option.email&&option.tab&&option.tab!='全部'){
      return db.message.count({where:{email:option.email,tab:option.tab}});
   }else{
      return db.message.count({where:{email:option.email}});
   }
}

exports.getPersonMessage=function (option) {
   if(option.email&&option.tab&&option.tab!='全部'){
      return db.message.findAll({where:{email:option.email,tab:option.tab},order:[['creatAt','DESC']],offset:option.offset,limit:option.limit,raw:true});
   }else{
      return db.message.findAll({where:{email:option.email},order:[['creatAt','DESC']],offset:option.offset,limit:option.limit,raw:true});
   }
}