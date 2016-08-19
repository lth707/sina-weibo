/**
 * Created by duoyi on 2016/8/18.
 */
var db=require('../models');
exports.createMessage=function (message) {
   return db.message.create(message);
}
exports.getMessage=function(option){
   if(option._id){
      return db.findOne({where:{_id:id}});
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