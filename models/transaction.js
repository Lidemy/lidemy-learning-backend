'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    bankCode: DataTypes.STRING,
    isDelete: DataTypes.BOOLEAN,
    isCreateByAdmin: DataTypes.BOOLEAN,
    status: {
      type: DataTypes.ENUM(['pending', 'confirming', 'paid']),
      defaultValue: 'pending'
    },
    expireTime: DataTypes.DATE,
    paidTime: DataTypes.DATE
  });
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User);
  };
  return Transaction;
};

