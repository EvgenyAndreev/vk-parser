// Setup
var VK = require('vksdk');

/**
 * Request server methods
 */
	
var GroupsGet = function(user_id){
	console.log(user_id);
	var vk = new VK({
	   'appId'     : 4818619,
	   'appSecret' : 'hQjqFL5V6gSnRxeNB6g8',
	   'language'  : 'ru'
	});
	vk.on('serverTokenReady', function(_o) {
	    // Here will be server access token
	    vk.setToken(_o.access_token);
	});	
	vk.setSecureRequests(true);
	// Request 'users.get' method
	vk.request('users.getSubscriptions', {'user_id' : user_id}, function(res) {
	    console.log(res.response.groups);
	});
};

var LikesGet = function(user_id, group_id){
	console.log(vkid);
	var vk = new VK({
	   'appId'     : 4818619,
	   'appSecret' : 'hQjqFL5V6gSnRxeNB6g8',
	   'language'  : 'ru'
	});
	vk.on('serverTokenReady', function(_o) {
	    // Here will be server access token
	    vk.setToken(_o.access_token);
	});	
	vk.setSecureRequests(true);
	// Request 'users.get' method
	vk.request('users.get', {'user_id' : user_id}, function(_o) {
	    console.log(_o);
	});
};

module.exports = {GroupsGet, LikesGet};

