"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("Users", {
    id: DataTypes.INTEGER,
    vkid: DataTypes.INTEGER,
    name: DataTypes.STRING
  }
  });

  return User;
};