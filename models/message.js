/**
 * Created by duoyi on 2016/8/15.
 */
var moment = require('moment-timezone');
module.exports=function (sequelize,DataTypes) {
    return sequelize.define('message',{
        _id: {
            type: DataTypes.STRING(50),
            defaultValue:DataTypes.UUIDV1,
            primaryKey: true
        },//唯一的标志
        email: {
            type: DataTypes.STRING(30),
            allowNull:false
        },//邮箱,代表是哪个账户发布的。
        from:{
            type: DataTypes.STRING(50),
            allowNull:true
        },//表示转发自哪条微博的_id
        forwardCount:{
           type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },//转发的次数
        commentCount:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },//评论的次数
        supportCount:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        creatAt:{
            type:DataTypes.STRING(30),
            allowNull:false,
            defaultValue:moment().tz("Asia/Hong_Kong").format('YYYY-MM-DD HH:mm:ss')
        },//创建时间
        content:{
            type:DataTypes.STRING(255),
            allowNull:false
        },//消息的内容
        pictures:{
            type:DataTypes.TEXT,
            allowNull:true,
        },//消息的图片。
        tab:{
            type:DataTypes.ENUM("原创","图片","视频","音乐",'文章'),
            allowNull:false,
            defaultValue:'原创'
        },//代表微博的种类
        topic:{
            type:DataTypes.STRING(255),
            allowNull:true
        }//话题
    }, {
        timestamps: false
    });
}