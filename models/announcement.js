'use strict';
module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
    UserId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  Announcement.associate = function(models) {
    Announcement.belongsTo(models.User)
  };
  return Announcement;
};