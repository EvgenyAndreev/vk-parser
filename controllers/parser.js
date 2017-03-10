// Setup
var vk = require('vk-sdk');
var db = require('./db');
var SqlString = require('sqlstring');
var emojiStrip = require('emoji-strip')
var membersGroups = []; // массив участников группы
var iter = 1;
/**
 * Request server methods
 */
 
vk.setToken("315e00e8315e00e831e2eaf61c311786533315e315e00e8699e6725d033d9494d432de2");
//vk.setToken('bcfb52c5bcfb52c5bc47b8db03bcb2d47ebbcfbbcfb52c5e43acf406d35c1d88e4647dc');

function symbol_check(input) {
  return /^\w+$/i.test(input);
}

var GroupsGet = function(user_id, callback){
	
	vk.callMethod('users.get', {
	    uids: user_id
	})
    .then(function (response) {
        console.log('Success: ' + JSON.stringify(response));
        // Success: [{"uid":1,"first_name":"Pavel","last_name":"Durov"},{"uid":5,"first_name":"Ilya","last_name":"Perekopsky"}] 
    })
    .catch(function (error) {
        console.log('Fail: ' + JSON.stringify(error));
    });
    
    vk.callMethod('users.getSubscriptions', {
	    user_id: user_id
	})
    .then(function (response) {
        console.log('Success: ' + JSON.stringify(response));
        var items = response.groups.items;
		items.forEach(function(item, i, items){
			setTimeout(function() {
				//Запрос данных о конкретной группе
				vk.callMethod('groups.getById', {
				    group_id: item,
				    fields: 'members_count,counters'
				})
			    .then(function (response) {
				    //console.log('Success: ' + JSON.stringify(response));
				    
				    //Пишем в БД данные о группе
				    let values = {
					    'group_id': response[0].gid, 
					    'group_name': response[0].name, 
					    'members_count': response[0].members_count
				    };
				    db.group.upsert(values);
				    
			    })
			    .catch(function (error) {
			        console.log('Fail: ' + JSON.stringify(error));
			    });
		    }, i*500);
		});
	    callback(response.groups);
	    return;
    })
    .catch(function (error) {
        console.log('Fail: ' + JSON.stringify(error));
    });
	
}

var PostsGet = function(group_id, callback){
	db.post.count({ where: ["group_id = ?", group_id] }).then(function(count) {
		
		vk.callMethod('wall.get', {
		    owner_id: "-"+group_id,
		    extended: 1,
		    count: 100,
		    offset: count
		})
	    .then(function (response) {
	        //console.log('Success: '+ iter + '_' + JSON.stringify(response));
	        var posts = response.wall;
	        var values = Array();
			posts.forEach(function(item, i, posts){
				var text = '';
				console.log(text);
			    values.push({
				    'group_id': group_id, 
				    'post_id': item.id, 
				    'text': text,
				    'post_type': item.post_type
				});
			});
			db.post.bulkCreate(values, {returning: true});
			if(response){
				setTimeout(function() {
					PostsGet(group_id);}
				, iter*333);
			}
			callback(response.profiles);
			return;
	    })
	    .catch(function (error) {
		    iter = 1;
	        console.log('Fail: ' + JSON.stringify(error));
	    });
	    
	})
};



function getMembers20k(group_id, members_count) {
	/*
	db.groupusers.count({ where: ["group_id = ?", group_id] }).then(function(offset) {
		vk.serverAuth({client_id: '4987107', client_secret: 'N2HdJ79ZXSrsZmdniHnF'})
		.then(function (response) {
			console.log('TOKEN: ' + JSON.stringify(response));
			var max_iterations = members_count / 1000;
			var iterations = 25;
			if(max_iterations>25){iterations = 25;}
			for (i = 0; i < iterations; i++) {
				vk.appendCall('groups.getMembers', {
					group_id: group_id,
					v: '5.62'
				})
			    .then(function (response) {
				    var items = response.items;
				    items.forEach(function(item, i, data){
					    let values = {
						    'group_id': group_id, 
						    'user_id': item
					    };
					    db.groupusers.upsert(values);
				    });
			        console.log(JSON.stringify(response));
			    })
			    .catch(onError);
			}
			vk.execute().then(function(){
				if(max_iterations>25){
					setTimeout(function() {
						getMembers20k(group_id, members_count);}
					, 333);
				}
			});
		})
		 .catch(function (error) {
		      console.log('Fail: ' + JSON.stringify(error));
		 });
	})
	*/
}

function onError (error) {
    console.log(JSON.stringify(error));
}

var MembersGet = function(group_id, members_count, callback){
	db.groupusers.count({ where: ["group_id = ?", group_id] }).then(function(offset) {
			vk.callMethod('groups.getMembers', {
	        	group_id: group_id,
	        	count: 1000,
	        	offset: offset,
	        	v: '5.62'
	        })
		    .then(function (response) {
			    var items = response.items;
			    var values = Array();
			    groupusers.max('id').then(function(max) {
				    var last_id = max;
				    items.forEach(function(item, i, data){
					    last_id++;
					    values.push({
						    'id': last_id,
						    'group_id': group_id, 
						    'user_id': item
					    });
				    });
				    console.log(values);
				    db.groupusers.bulkCreate(values, {returning: true});
				});
		    })
		    .catch(function (error) {
		        console.log('Fail getMembers: ' + group_id +'_'+ offset +'_'+ members_count +'_'+ JSON.stringify(error));
		    });
		    
			var max_iterations = (members_count - offset) / 1000;
			if(max_iterations>=1){
				setTimeout(function() {
					MembersGet(group_id, members_count);}
				, 333);
			}
	});
        	

//getMembers20k(group_id, members_count)
}

var CommentsGet = function(group_id, callback){
	
	//Подгрузить все посты выбранной группы
	db.post.findAll({ where: { group_id: group_id }, order: 'id DESC' }).then(function(posts) {
		//Перебор постов с задержкой
		posts.forEach(function(post, i, posts){
			setTimeout(function() {
				db.like.count({ where: {group_id: group_id, post_id: post.post_id}}).then(function(offset) {
					/*console.log({
			        	type: post.post_type,
			        	owner_id: "-"+post.group_id,
			        	item_id: post.post_id,
			        	count: 1000,
			        	offset: offset,
			        	v: '5.62'
			        });*/
					vk.callMethod('likes.getList', {
			        	type: post.post_type,
			        	owner_id: "-"+post.group_id,
			        	item_id: post.post_id,
			        	count: 1000,
			        	offset: offset,
			        	v: '5.62'
			        })
				    .then(function (response) {
					    var items = response.items;
					    var values = Array();
					    var last_id = 0;
					    db.like.max('id').then(function(max) {
						    var last_id = max+1;
						    items.forEach(function(item, i, data){
							    last_id++;
							    values.push({
								    'id': last_id,
								    'group_id': post.group_id, 
								    'post_id': post.post_id, 
								    'user_id': item
							    });
						    });
						    console.log(values);
						    db.like.bulkCreate(values, {returning: true});
						    /*
							setTimeout(function() {
								CommentsGet(group_id);}
							, 1333);
							*/
						});
				    })
				    .catch(function (error) {
				        console.log('Fail getMembers: ' + group_id +'_'+ offset +'_'+ members_count +'_'+ JSON.stringify(error));
				    });
			    });
			}, i*400);
		});
			
	});
};

module.exports = {GroupsGet, PostsGet, MembersGet, CommentsGet};

