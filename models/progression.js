'use strict';
module.exports = (sequelize, DataTypes) => {
  const Progression = sequelize.define('Progression', {
    UserId: DataTypes.INTEGER,
    level: DataTypes.INTEGER
  }, {});
  Progression.associate = function(models) {
    // associations can be defined here
  };
  return Progression;
};