'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    picture: DataTypes.STRING,
    progress: DataTypes.INTEGER,
    githubId: DataTypes.INTEGER,
    isDelete: DataTypes.BOOLEAN,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Progression)
    User.hasMany(models.Report)
  };
  return User;
};