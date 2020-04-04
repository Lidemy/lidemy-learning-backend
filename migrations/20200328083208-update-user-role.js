'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', "isTA", { 
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn('Users', "role", { 
        type: Sequelize.INTEGER
      }),   
      queryInterface.addColumn('Users', "slackId", { 
        type: Sequelize.STRING
      }),   
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', "isTA"),
      queryInterface.removeColumn('Users', "role"),   
      queryInterface.removeColumn('Users', "slackId"),   
    ])
  }
};
