'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', "status", { 
        type: Sequelize.ENUM,
        values: ['active', 'inactive']
      }),
      queryInterface.addColumn('Users', "semester", { 
        type: Sequelize.INTEGER
      }),   
      queryInterface.addColumn('Users', "priceType", { 
        type: Sequelize.ENUM,
        values: ['A', 'B']
      }),
      queryInterface.removeColumn('Users', "role")     
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', "status"),
      queryInterface.removeColumn('Users', "semester"),   
      queryInterface.removeColumn('Users', "priceType"), 
      queryInterface.addColumn('Users', "role", { 
        type: Sequelize.INTEGER
      }),  
    ])
  }
};
