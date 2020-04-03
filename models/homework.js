'use strict';
module.exports = (sequelize, DataTypes) => {
  const Homework = sequelize.define('Homework', {
    UserId: DataTypes.INTEGER,
    prUrl: DataTypes.TEXT,
    isAchieve: DataTypes.BOOLEAN,
    TAId: DataTypes.INTEGER,
    week: DataTypes.INTEGER
  });
  Homework.associate = function(models) {
    Homework.belongsTo(models.User)
  };
  return Homework;
};

