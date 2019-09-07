'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.STRING
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      githubId: {
        type: Sequelize.INTEGER
      },
      isDelete: {
        type: Sequelize.BOOLEAN
      },
      isAdmin: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      queryInterface.addConstraint('Users', ['email'], {
        type: 'unique',
        name: 'email_unique'
      });
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};