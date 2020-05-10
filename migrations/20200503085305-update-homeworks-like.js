'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Homework', "isLike", { 
        type: Sequelize.BOOLEAN,
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Homework', "isLike")
  }
};
