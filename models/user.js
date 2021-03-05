'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    picture: DataTypes.STRING,
    progress: DataTypes.INTEGER,
    githubId: DataTypes.INTEGER,
    isDelete: DataTypes.BOOLEAN,
    isAdmin: DataTypes.BOOLEAN,
    isTA: DataTypes.BOOLEAN,
    isStudent: DataTypes.BOOLEAN,
    slackId: DataTypes.STRING,
    semester: DataTypes.INTEGER,
    priceType: DataTypes.ENUM(['A', 'B']),
    status: DataTypes.ENUM(['active', 'inactive']),
    weight: DataTypes.FLOAT,
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Progression)
    User.hasMany(models.Report)
    User.hasMany(models.Homework, {
      as: 'homeworks',
      foreignKey: 'TAId'
    })
  };
  return User;
};