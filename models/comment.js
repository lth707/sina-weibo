/**
 * Created by duoyi on 2016/8/15.
 */
module.exports=function(sequelize,DataTypes){
    return sequelize.define('comment',{
        _id: {
            type: DataTypes.UUID,
            defaultValue:DataTypes.UUIDV1,
            primaryKey: true
        },//唯一的标志
        creatAt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:new Date()
        },//创建时间
        content:{
            type:DataTypes.STRING(256),
            allowNull:false
        },//评论的内容
        email: {
            type: DataTypes.STRING(30),
            allowNull:false
        },//邮箱,代表是哪个账户评论的
        toEmail:{
            type: DataTypes.STRING(30),
            allowNull:true
        },//表示有没有回复某个用户
        isForward:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:0
        },//表示是否为转发的评论
        msgId:{
            type: DataTypes.UUID,
            allowNull:false
        }//表示是评论哪条微博
    });
}