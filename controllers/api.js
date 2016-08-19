/**
 * Created by duoyi on 2016/8/15.
 */
var dbAccess = require('../services');
var Promise = require('bluebird').noConflict();
exports.getSignup = getSignup;
exports.postSignup = postSignup;
exports.checkLogin = checkLogin;
exports.checkFormData = checkFormData;
exports.getLogin = getLogin;
exports.postLogin = postLogin;
exports.getIndex = getIndex;
exports.logout = logout;
exports.getCreate = getCreate;
exports.postCreate = postCreate;
exports.getUserInfo = getUserInfo

function getIndex(req, res, next) {
    res.locals.tabs = ["全部", "原创", "图片", "视频", "音乐", '文章'];
    res.locals.tab = req.query.tab || '全部';
    var p = res.locals.p = req.query.p || 1;
    dbAccess.getMessageCount({tab: req.query.tab}).then(function (result) {
        res.locals.total = result;
        dbAccess.getMessage({tab: req.query.tab, offset: (p - 1) * 10, limit: 10}).then(function (results) {
            return Promise.each(results, function (result) {
                return dbAccess.getUserByEmail(result.email).then(function (user) {
                    delete user.password;
                    result.user = user;
                })
            }).then(function () {
                res.locals.messageArr = results
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
            var user = new Object();
            user.email = result.email;
            user.nickName = result.nickName;
            user.signature = result.signature;
            user.gender = result.gender;
            user.head = result.head;
            req.session.user = user;
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
    if (req.session && req.session.user) {
        req.flash('error', '用户已登录！');
        return res.redirect('/');
    } else {
        next();
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
    if (req.session.user) {
        req.session.user = null;
        req.flash('success', '已退出登录！');
        return res.redirect('/');
    } else {
        req.flash('error', '用户未登录！');
        return res.redirect('/');
    }
}

function getCreate(req, res, next) {
    if (req.session && req.session.user) {
        res.locals.tabs = ["全部", "原创", "图片", "视频", "音乐", '文章'];
        return res.render('create');
    } else {
        req.flash('error', '请先登录！');
        return res.redirect('/')
    }
}

function postCreate(req, res, next) {
    console.log(req.body);
    var message = new Object();

    if (req.session && req.session.user) {
        if (req.body.email == '' || req.body.content == '' || req.body.tab == '') {
            req.flash('error', '请填写完整！');
            return res.redirect('/create');
        }
        message.email = req.body.email;
        message.tab = req.body.tab;
        message.topic = req.body.topic;
        message.content = req.body.content;
        message.forwardCount = 0;
        message.commentCount = 0;
        message.from = '';
        message.pictures = '';
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
    dbAccess.getUserInfo(email).then(function (result) {
        return res.send(result);
    });
}