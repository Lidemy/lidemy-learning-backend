'use strict';
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    UserId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    wordCount: DataTypes.INTEGER
  }, {});
  Report.associate = function(models) {
    Report.belongsTo(models.User)
  };
  return Report;
};