/**
 * Created by duoyi on 2016/9/6.
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('classify', {
    id     : {
      type         : DataTypes.INTEGER(11),
      primaryKey   : true,
      autoIncrement: true,
      allowNull    : false,
      comment      : '自增id'
    },
    focusid: {
      type: DataTypes.INTEGER(11),
      references: {module: 'focus', key: 'id'},
      onDelete  : 'CASCADE',
      onUpdate  : 'CASCADE',
      allowNull: false,
      comment: '关注表id'
    },
    groupid: {
      type: DataTypes.INTEGER(11),
      references: {module: 'group', key: 'id'},
      onDelete  : 'CASCADE',
      onUpdate  : 'CASCADE',
      allowNull: false,
      comment: '分组表id'
    }
  });
}