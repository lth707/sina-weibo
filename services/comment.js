/**
 * Created by duoyi on 2016/8/30.
 */
var db=require('../models');
exports.getCommentsByMessageId=function (option){
     var msgId=option.msgId;
     return db.comment.findAll({where:{msgId:msgId},order:[['creatAt','DESC']],raw:true});
}
exports.getMessageFrowardComment=function (option) {
     var msgId=option.msgId;
     return db.comment.findAll({where:{msgId:msgId,isForward:1},order:[['creatAt','DESC']],raw:true});
}
exports.createComment=function (comment) {
     return db.comment.create(comment);
}