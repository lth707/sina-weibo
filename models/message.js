/**
 * Created by duoyi on 2016/8/15.
 */
module.exports=function (sequelize,DataTypes) {
    return sequelize.define('message',{
        _id: {
            type: DataTypes.UUID,
            defaultValue:DataTypes.UUIDV1,
            primaryKey: true
        },//唯一的标志
        email: {
            type: DataTypes.STRING(30),
            allowNull:false
        },//邮箱,代表是哪个账户发布的。
        from:{
            type: DataTypes.UUID,
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
        creatAt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:new Date()
        },//创建时间
        content:{
            type:DataTypes.STRING(256),
            allowNull:false
        },//消息的内容
        pictures:{
            type:DataTypes.TEXT,
            allowNull:true,
            defaultValue:''
        }//消息的图片。
    });
}