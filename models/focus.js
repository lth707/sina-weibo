/**
 * Created by duoyi on 2016/9/6.
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('focus', {
    id       : {
      type         : DataTypes.INTEGER(11),
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : '自增id' 
    },
    follow   : {
      type     : DataTypes.INTEGER(30),
      allowNull: false,
      comment  : '粉丝对象'
    },
    target   : {
      type     : DataTypes.INTEGER(30),
      allowNull: false,
      comment  : '关注对象'
    },
    buildtime: {
      type     : DataTypes.STRING(25),
      allowNull: false,
      comment  : '关注时间'
    }
  });
}