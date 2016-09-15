/**
 * Created by duoyi on 2016/8/15.
 */
'use strict'
var dbAccess = require('../services');
var Promise  = require('bluebird').noConflict();
var moment   = require('moment-timezone');
var config   = require('config');
var uuid     = require('node-uuid');
const fs     = require('fs');
const path   = require('path');

exports.getSignup            = getSignup;
exports.postSignup           = postSignup;
exports.checkLogin           = checkLogin;
exports.checkLogout          = checkLogout;
exports.checkFormData        = checkFormData;
exports.getLogin             = getLogin;
exports.postLogin            = postLogin;
exports.getIndex             = getIndex;
exports.logout               = logout;
exports.getCreate            = getCreate;
exports.postCreate           = postCreate;
exports.getUserInfo          = getUserInfo
exports.getMessageAndComment = getMessageAndComment;
exports.postComment          = postComment;
exports.postGoodForMessage   = postGoodForMessage;
exports.getForwardAndMessage = getForwardAndMessage;
exports.postForwardComment   = postForwardComment;

function getIndex(req, res, next) {
  res.locals.tabs = ["全部", "原创", "图片", "视频", "音乐", '文章'];
  res.locals.tab  = req.query.tab || '全部';
  var p           = res.locals.p = req.query.p || 1;
  dbAccess.getMessageCount({tab: req.query.tab}).then(function (result) {
    res.locals.total = result;
    dbAccess.getMessage({tab: req.query.tab, offset: (p - 1) * 10, limit: 10}).then(function (results) {
      return Promise.each(results, function (result) {
        if(result.pictures){
          result.pictures=result.pictures.split(',').map((picture)=>{
            return path.join(config.pictureFile.message,picture);
          });
        }else{
          result.pictures=[];
        }
        if (result.from) {
          return dbAccess.getMessageFrowardComment({msgId: result._id, isForward: 1}).then(function (forwardComment) {
             result.forwardCommentContent=forwardComment[0].content;
             return;
          }).then(function () {
            return dbAccess.getUserByEmail(result.email).then(function (user) {
              delete user.password;
              result.user = user;
              return;
            });
          });
        } else {
          return dbAccess.getUserByEmail(result.email).then(function (user) {
            delete user.password;
            result.user = user;
            return;
          })
        }
      }).then(function () {
        res.locals.messageArr = results;
        return;
      })
    }).then(function () {
      return res.render('index');
    })
  })

}
function getLogin(req, res, next) {
  return res.render('login');
}

function postLogin(req, res, next) {
  return dbAccess.getUser(req.body).then(function (result) {
    if (result) {
      var user                    = new Object();
      user.email                  = result.email;
      user.nickName               = result.nickName;
      user.signature              = result.signature;
      user.gender                 = result.gender;
      user.head                   = result.head;
      req.session[req.session.id] = user;
      req.flash('success', '登录成功！');
      return res.send({code: 200});
    } else {
      req.flash('error', '用户不存在！');
      return res.send({code: 302});
    }
  }).catch(function (err) {
    req.flash('error', '数据库查询出错！');
    return res.send({code: 302});
  });
}
function getSignup(req, res, next) {
  return res.render('signup');
}

function postSignup(req, res, next) {
  var body = req.body;

  dbAccess.getUserByEmail(body.email).then(function (result) {
    if (result) {
      req.flash('error', '该邮箱已经注册过！');
      return res.redirect('/signup');
    } else {
      dbAccess.addUser(req.body).then(function (result) {
        req.flash('success', '注册成功！');
        return res.redirect('/login');
      }).catch(function (err) {
        req.flash('error', '数据库出错，注册失败！');
        return res.redirect('/signup');
      })
    }
  });
}


function checkLogin(req, res, next) {
  if (req.session && req.session[req.session.id]) {
    req.flash('error', '用户已登录！');
    return res.redirect('/');
  } else {
    next();
  }
}
function checkLogout(req, res, next) {
  if (req.session && req.session[req.session.id]) {
    next();
  } else {
    req.flash('error', '请先登录！');
    return res.send({code: 304});
  }
}
function checkFormData(req, res, next) {
  if (req.body.nickname.trim() == '') {
    req.flash('error', '请填写用户昵称！');
    return res.redirect('/signup');
  }
  if (req.body.email.trim() == '') {
    req.flash('error', '请填写注册邮箱！');
    return res.redirect('/signup');
  }
  if (req.body.gender.trim() == '') {
    req.flash('error', '请填写性别！');
    return res.redirect('/signup');
  } else {
    if (['男', '女'].indexOf(req.body.gender) == -1) {
      req.flash('error', '请填写正确的性别！');
      return res.redirect('/signup');
    }
  }
  if (req.body.password.trim() == '') {
    req.flash('error', '密码不能为空！');
    return res.redirect('/signup');
  } else {
    if (req.body.password !== req.body.re_password) {
      req.flash('error', '前后密码不一致！');
      return res.redirect('/signup');
    }
  }
  next();

}
function logout(req, res, next) {
  if (req.session[req.session.id]) {
    req.session[req.session.id] = null;
    req.flash('success', '已退出登录！');
    return res.redirect('/');
  } else {
    req.flash('error', '用户未登录！');
    return res.redirect('/');
  }
}

function getCreate(req, res, next) {
  if (req.session && req.session[req.session.id]) {
    res.locals.tabs = ["全部", "原创", "图片", "视频", "音乐", '文章'];
    return res.render('create');
  } else {
    req.flash('error', '请先登录！');
    return res.redirect('/')
  }
}

function postCreate(req, res, next) {
  var message = new Object();

  if (req.session && req.session[req.session.id]) {
    if (req.body.email == '' || req.body.content == '' || req.body.tab == '') {
      req.flash('error', '请填写完整！');
      return res.redirect('/create');
    }
    if (req.body.pictures) {
      req.body.pictures.split(',').forEach(function (pictureName) {
        let pictureOldPath = path.join(config.pictureFile.uploadPictureFile, pictureName);
        if (fs.existsSync(pictureOldPath)) {
          let pictureNewPath = path.join(config.pictureFile.messagePictureFile, pictureName);
          try {
            fs.renameSync(pictureOldPath, pictureNewPath);
          } catch (err) {
            return res.json({msg: '转存图片出错'});
          }
        }
      });
    }
    message.email        = req.body.email;
    message.tab          = req.body.tab;
    message.topic        = req.body.topic;
    message.content      = req.body.content;
    message.forwardCount = 0;
    message.commentCount = 0;
    message.from         = '';
    message.pictures     = req.body.pictures || '';
    message.creatAt      = moment().tz("Asia/Hong_Kong").format('YYYY-MM-DD HH:mm:ss');
    dbAccess.createMessage(message).then(function (result) {
      req.flash('success', '发布成功！');
      return res.redirect('/');
    });
  } else {
    req.flash('error', '请先登录！');
    return res.redirect('/login');
  }

}


function getUserInfo(req, res, next) {
  var email = req.params['email'];
  Promise.resolve().then(function () {
    if (req.session[req.session.id] && email == req.session[req.session.id].email) {
      res.locals.tabTitles = ['我的主页', '我的相册', '管理中心'];
      res.locals.tabTitle  = req.query.tabTitle || '我的主页';
      res.locals.lookUser  = req.session[req.session.id]
      return;
    } else {
      return dbAccess.getUserByEmail(email).then(function (data) {
        delete data.password;
        res.locals.lookUser = data;
        if (data.gender == '男') {
          res.locals.tabTitles = ['他的主页', '他的相册'];
          res.locals.tabTitle  = req.query.tabTitle || '他的主页';
        } else {
          res.locals.tabTitles = ['她的主页', '她的相册'];
          res.locals.tabTitle  = req.query.tabTitle || '她的主页';
        }
        return;
      });
    }
  }).then(function () {
    res.locals.tabs = ["全部", "原创", "图片", "视频", "音乐", '文章'];
    res.locals.tab  = req.query.tab || '全部';
    var p           = res.locals.p = req.query.p || 1;
    return dbAccess.getPersonMessageCount({email: email, tab: req.query.tab}).then(function (result) {
      res.locals.total = result;
    }).then(function () {
      return dbAccess.getPersonMessage({
        email : email,
        tab   : req.query.tab,
        offset: (p - 1) * 10,
        limit : 10
      }).then(function (results) {
        return Promise.each(results, function (result) {
          if(result.pictures){
            result.pictures=result.pictures.split(',').map((picture)=>{
              return path.join(config.pictureFile.message,picture);
            });
          }else{
            result.pictures=[];
          }
          return dbAccess.getUserByEmail(result.email).then(function (user) {
            delete user.password;
            result.user = user;
            return;
          })
        }).then(function () {
          res.locals.messageArr = results
          return;
        })
      });
    })
  }).then(function () {
    res.render('user');
  })
};

function getMessageAndComment(req, res, next) {
  var _id         = req.params['id'];
  if (req.session[req.session.id]){
    res.locals.user = req.session[req.session.id];
    dbAccess.getMessage({_id: _id}).then(function (message) {
      return dbAccess.getUserByEmail(message.email).then(function (user) {
        delete user.password;
        message.user = user;
        res.locals.message = message;
        return;
      });
    }).then(function () {
      return dbAccess.getCommentsByMessageId({msgId: _id}).then(function (comments) {

        return Promise.each(comments, function (comment) {
          return dbAccess.getUserByEmail(comment.email).then(function (user) {
            delete user.password;
            comment.commentUser = user;
            if (comment.toEmail) {
              return dbAccess.getUserByEmail(comment.toEmail).then(function (user) {
                delete user.password;
                comment.toReplyUser = user;
                return;
              });
            } else {
              return;
            }
          });
        }).then(function () {
          res.locals.message.comments = comments;
          return;
        })

      })
    }).then(function () {
      return res.render('message');

    });
  }else{
    return res.redirect('/login');
  }

}

function postComment(req, res, next) {
  var msgId        = req.body.msgId;
  var content      = req.body.content;
  var commentCount = parseInt(req.body.commentCount);
  if (content == '') {
    req.flash('error', '评论内容不能为空！');
    return res.redirect('/comment/' + msgId);
  } else {
    var comment       = new Object();
    comment.email     = req.session[req.session.id].email;
    comment.toEmail   = '';
    comment.content   = content;
    comment.creatAt   = moment().tz("Asia/Hong_Kong").format('YYYY-MM-DD HH:mm:ss');
    comment.isForward = false;
    comment.msgId     = msgId;
    dbAccess.createComment(comment).then(function () {
      return dbAccess.upDateMessage({commentCount: commentCount + 1}, {where: {_id: msgId}});
    }).then(function () {
      req.flash('success', '评论成功！');
      return res.redirect('/comment/' + msgId);
    });
  }

}

function postGoodForMessage(req, res, next) {
  var supportCount = parseInt(req.body.supportCount);
  var _id          = req.body.id;
  dbAccess.upDateMessage({supportCount: supportCount + 1}, {where: {_id: _id}}).then(function () {
    return res.send({supportCount: supportCount + 1});
  })
}


function getForwardAndMessage(req, res, next) {
  if (req.session && req.session[req.session.id]) {
    var msgId = req.query.id;
    dbAccess.getMessage({_id: msgId}).then(function (message) {
      return dbAccess.getUserByEmail(message.email).then(function (user) {
        delete user.password;
        message.dataValues.user = user;
        return;
      }).then(function () {
        return dbAccess.getMessageFrowardComment({msgId: msgId, isForward: 0}).then(function (forwardComments) {
          return Promise.each(forwardComments, function (forwardComment) {
            return dbAccess.getUserByEmail(forwardComment.email).then(function (user) {
              delete user.password;
              user.head           = config.picturesHostAndPort + config.pictureFile.head + user.head;
              forwardComment.user = user;
              return;
            });
          }).then(function () {
            message.dataValues.forwardComments = forwardComments;
            return res.send({code: 200, message: JSON.stringify(message)});
          });
        });
      });
    });
  } else {
    req.flash('error', '请先登录！');
    return res.send({code: 304});
  }
}

function postForwardComment(req, res, next) {
  if (req.session && req.session[req.session.id]) {
    var body = req.body;
    dbAccess.getMessage({_id: body.msgId}).then(function (message) {
      var forwardMessage          = new Object();
      forwardMessage._id          = uuid.v1();
      forwardMessage.creatAt      = moment().tz("Asia/Hong_Kong").format('YYYY-MM-DD HH:mm:ss');
      forwardMessage.commentCount = 1;
      forwardMessage.supportCount = 0;
      forwardMessage.email        = req.session[req.session.id].email;
      forwardMessage.from         = body.msgId;
      forwardMessage.forwardCount = 0;
      forwardMessage.tab          = '全部';
      if (message.from != '') {
        return (function getOrginMessage(message) {
          return dbAccess.getMessage({_id: message.from}).then(function (messageOrgin) {
            if (messageOrgin.from != '') {
              return getOrginMessage(messageOrgin);
            } else {
              forwardMessage.content = messageOrgin.content;
              forwardMessage.topic   = messageOrgin.topic;
              forwardMessage.pictures     =messageOrgin.pictures;
              return forwardMessage;
            }
          });
        })(message);

      } else {
        forwardMessage.content = message.content;
        forwardMessage.topic   = message.topic;
        forwardMessage.pictures=message.pictures;
        return forwardMessage;
      }

    }).then(function (forwardMessage) {

      return dbAccess.createMessage(forwardMessage).then(function () {
        //创建新建微博的转发评论。
        var comment       = new Object();
        comment.email     = req.session[req.session.id].email;
        comment.toEmail   = '';
        comment.content   = body.forwardCommentContent;
        comment.creatAt   = moment().tz("Asia/Hong_Kong").format('YYYY-MM-DD HH:mm:ss');
        comment.isForward = true;
        comment.msgId     = forwardMessage._id;
        return dbAccess.createComment(comment).then(function () {
          //创建被转发微博的评论。
          var comment       = new Object();
          comment.email     = req.session[req.session.id].email;
          comment.toEmail   = '';
          comment.content   = body.forwardCommentContent;
          comment.creatAt   = moment().tz("Asia/Hong_Kong").format('YYYY-MM-DD HH:mm:ss');
          comment.isForward = false;
          comment.msgId     = body.msgId;
          return dbAccess.createComment(comment);
        }).then(function () {
          return dbAccess.upDateMessage({
            forwardCount: parseInt(body.forwardCount) + 1,
            commentCount: parseInt(body.commentCount) + 1
          }, {where: {_id: body.msgId}});
        });
      });
    }).then(function () {
      return res.send({commentCount: parseInt(body.commentCount) + 1, forwardCount: parseInt(body.forwardCount) + 1});
    });

  }
  else {
    req.flash('error', '请先登录！');
    return res.send({code: 304});
  }

}