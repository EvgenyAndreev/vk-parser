"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("post", {
    group_id: {type: DataTypes.INTEGER},
    post_id: {type: DataTypes.INTEGER},
    post_type: {type: DataTypes.STRING},
    text: {type: DataTypes.TEXT},
    photo: DataTypes.STRING
  },{
	  tableName: 'Posts'
  });

  return Post;
};
