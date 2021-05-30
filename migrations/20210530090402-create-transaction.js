'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      bankCode: {
        type: Sequelize.STRING
      },
      isDelete: {
        type: Sequelize.BOOLEAN
      },
      isCreateByAdmin: {
        type: Sequelize.BOOLEAN
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'confirming', 'paid']
      },
      expireTime: {
        type: Sequelize.DATE
      },
      paidTime: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};