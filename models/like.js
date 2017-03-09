"use strict";

module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define("like", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    group_id: {type: DataTypes.BIGINT(20)},
    post_id: {type: DataTypes.BIGINT(20)},
    user_id: {type: DataTypes.BIGINT(20)}
  },{
	  tableName: 'Likes'
  });

  return Like;
};