/**
 * Created by duoyi on 2016/8/15.
 */
module.exports=function (sequelize,DataTypes) {
    return sequelize.define('user',{
        email: {
            type: DataTypes.STRING(30),
            primaryKey: true
        },//邮箱
        nickName:{
            type:DataTypes.STRING(36),
            allowNull:false
        },//昵称
        gender:{
            type:DataTypes.ENUM('男','女'),
            allowNull:false,
            defaultValue:'男'
        },//性别，true表示男，false表示女
        password:{
            type:DataTypes.STRING(11),
            allowNull:false
        },//密码
        signature:{
            type:DataTypes.STRING(50),
            allowNull:true
        },//个性签名
        head:{
            type:DataTypes.STRING(50),
            allowNull:true
        }//用户头像
    });
}