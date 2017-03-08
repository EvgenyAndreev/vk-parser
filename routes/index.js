var express = require('express');
var vk = require('../searching');
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
	vk.GroupsGet(req.body.vkid);
	  res.render('searching_groups', {
	    title: 'Открытые группы'
	  });
});

router.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact'
  });
});

module.exports = router;
