"use strict";

module.exports = function(sequelize, DataTypes) {
  var GroupUsers = sequelize.define("groupusers", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    group_id: {type: DataTypes.INTEGER},
    user_id: {type: DataTypes.INTEGER}
  },{
	  tableName: 'Users_in_groups'
  });

  return GroupUsers;
};