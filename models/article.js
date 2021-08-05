'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    UserId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    nickname: DataTypes.STRING,
    isDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  });
  Article.associate = function(models) {
    Article.belongsTo(models.User);
    Article.hasMany(models.Comment);
  };
  return Article;
};

