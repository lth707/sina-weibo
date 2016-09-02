/**
 * Created by duoyi on 2016/8/17.
 */
var User=require('./user');
var Message=require('./message');
var Comment=require('./comment');
exports.getUserByEmail=User.getUserByEmail;
exports.addUser=User.addUser;
exports.getUser=User.getUser;
exports.createMessage=Message.createMessage;
exports.getMessage=Message.getMessage;
exports.getMessageCount=Message.getMessageCount;
exports.upDateMessage=Message.upDateMessage;
exports.getPersonMessage=Message.getPersonMessage;
exports.getPersonMessageCount=Message.getPersonMessageCount;
exports.getCommentsByMessageId=Comment.getCommentsByMessageId;
exports.getMessageFrowardComment=Comment.getMessageFrowardComment;
exports.createComment=Comment.createComment;