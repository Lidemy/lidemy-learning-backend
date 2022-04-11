'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', "checkAnniversary", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  }

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', "checkAnniversary")
  }
};
