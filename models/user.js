"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    vkid: {type: DataTypes.INTEGER,  unique: true},
    name: DataTypes.STRING
  },{
	  tableName: 'Users'
  });

  return User;
};