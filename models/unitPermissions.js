'use strict';
module.exports = (sequelize, DataTypes) => {
  const UnitPermissions = sequelize.define('Unit_Permissions', {
    UserId: DataTypes.INTEGER,
    week: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
  });
  UnitPermissions.associate = function(models) {
    UnitPermissions.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'UserId'
    });
  };
  return UnitPermissions;
};

