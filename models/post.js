"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("post", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    group_id: {type: DataTypes.INTEGER},
    post_id: {type: DataTypes.INTEGER},
    post_type: {type: DataTypes.STRING},
    text: {type: DataTypes.STRING},
    photo: DataTypes.STRING
  },{
	  tableName: 'Posts'
  });

  return Post;
};