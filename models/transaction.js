'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    bankCode: DataTypes.STRING,
    isDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isCreateByAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
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

