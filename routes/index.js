var express = require('express');
var parser = require('../controllers/parser');

var router = express.Router();

router.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

router.get('/searching_groups', function(req, res){
  res.render('searching_groups', {
    title: 'Открытые группы'
  });
});

router.post('/searching_groups', function(req, res){
	parser.GroupsGet(req.body.vkid, function(data){
		
		var items = data.items;
		res.render('searching_groups', {
				    title: 'Открытые группы',
				    groups: items
		});
		
		items.forEach(function(item, i, items){
			setTimeout(function() {
				parser.PostsGet(item, function(data){
					//res.render('block_profile', {id: data.id});
				});
			}, i*500);
		});
		
		/*
				res.render('searching_groups', {
				    title: 'Открытые группы',
				    groups: items,
				    profiles: data
				});*/
	});
	//console.log(groups);
	// posts get & likes get
	// out group _ post link
	  
});

router.get('/api/members/:group_id', function(req, res){
	console.log(req.params.group_id);
	parser.MembersGet(req.params.group_id, '398705', function(data){	
		res.send('DONE');
	});
	/*
	parser.PostsGet(req.group_id, function(data){	
		var items = data.items;
		items.forEach(function(item, i, items){
			setTimeout(function() {
				parser.CommentsGet(item, function(data){
					res.send({id: 1, comment: "100"});
				});
			}, i*3000);
		});
	});*/
});

router.get('/api/comments/:group_id', function(req, res){
	console.log(req.params.group_id);
	parser.CommentsGet(req.params.group_id, function(data){	
		res.send('DONE');
	});
	/*
	parser.PostsGet(req.group_id, function(data){	
		var items = data.items;
		items.forEach(function(item, i, items){
			setTimeout(function() {
				parser.CommentsGet(item, function(data){
					res.send({id: 1, comment: "100"});
				});
			}, i*3000);
		});
	});*/
});

router.get('/api/posts/:group_id', function(req, res){
	console.log(req.params.group_id);
	parser.PostsGet(req.params.group_id, function(data){	
		res.send('DONE');
	});
	/*
	parser.PostsGet(req.group_id, function(data){	
		var items = data.items;
		items.forEach(function(item, i, items){
			setTimeout(function() {
				parser.CommentsGet(item, function(data){
					res.send({id: 1, comment: "100"});
				});
			}, i*3000);
		});
	});*/
});

router.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact'
  });
});

module.exports = router;
