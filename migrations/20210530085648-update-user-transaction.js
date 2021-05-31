'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', "isPlanSelected", { 
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn('Users', "disablePlanSelect", { 
        type: Sequelize.BOOLEAN
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', "isPlanSelected"),
      queryInterface.removeColumn('Users', "disablePlanSelect"),
    ])
  }
};
