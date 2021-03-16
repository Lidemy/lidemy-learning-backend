'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define('Notes', {
    UserId: DataTypes.INTEGER,
    week: DataTypes.INTEGER,
    title: DataTypes.TEXT,
    link: DataTypes.TEXT,
  });
  Notes.associate = function(models) {
    Notes.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'UserId'
    });
  };
  return Notes;
};

