/**
 * Created by duoyi on 2016/8/17.
 */
var User=require('./user');
var Message=require('./message');
exports.getUserByEmail=User.getUserByEmail;
exports.addUser=User.addUser;
exports.getUser=User.getUser;
exports.createMessage=Message.createMessage;
exports.getMessage=Message.getMessage;
exports.getMessageCount=Message.getMessageCount;
exports.getPersonMessage=Message.getPersonMessage;
exports.getPersonMessageCount=Message.getPersonMessageCount;