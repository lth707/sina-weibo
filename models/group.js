/**
 * Created by duoyi on 2016/9/6.
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('group', {
    id      : {
      type         : DataTypes.INTEGER(11),
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : '自增id' 
    },
    email   : {
      type      : DataTypes.STRING(30),
      references: {module: 'user', key: 'email'},
      onDelete  : 'CASCADE',
      onUpdate  : 'CASCADE',
      allowNull : false,
      comment   : '分组所属用户'
    },
    name    : {
      type     : DataTypes.STRING(20),
      allowNull: false,
      comment  : '分组名称'
    },
    descript: {
      type        : DataTypes.STRING(80),
      allowNull   : true,
      defaultValue: '',
      comment     : '分组描述'
    }
  });
}