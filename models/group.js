"use strict";

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("group", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    group_id: {type: DataTypes.INTEGER, unique: true},
    group_name: DataTypes.STRING,
    members_count: {type: DataTypes.INTEGER},
    posts_count: {type: DataTypes.INTEGER}
  },{
	  tableName: 'Groups'
  });

  return Group;
};