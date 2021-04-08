'use strict';
module.exports = (sequelize, DataTypes) => {
  const Syllabus = sequelize.define('Syllabus', {
    title: DataTypes.TEXT,
    content: DataTypes.TEXT,
    week: DataTypes.INTEGER,
    category: DataTypes.STRING,
    visible: DataTypes.BOOLEAN,
  }, {});
  return Syllabus;
};