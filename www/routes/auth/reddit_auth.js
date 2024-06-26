var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var crypto = require('crypto');


router.get('/login/reddit', checkIfLoggedIn, function(req,res,next){
	crypto.randomBytes(24, function(err, buffer) {
		var RANDOM_STRING = buffer.toString('hex');
		// store it in the redis for later comparison?
		setCredential(req, 'rd_state', RANDOM_STRING);

		var url = new URL("https://www.reddit.com/api/v1/authorize"),
			params = {
			client_id: REDDIT_CLIENT_ID,
			response_type: "code",
			state: RANDOM_STRING,
			redirect_uri: REDDIT_CALLBACK_URL,
			duration: "temporary",
			scope: "read"
		}
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		res.redirect(url);
	});
});

router.get('/login/reddit/callback', checkIfLoggedIn, async function (req, res, next) {
	var code = req.query.code;
	var state = req.query.state;

	// check if state matches
	var obj = await retrieveCredentials(req);
	if (state === obj['rd_state']){
		// get access token
		var url = new URL("https://www.reddit.com/api/v1/access_token"), params = {
			grant_type: "authorization_code",
			code: code,
			redirect_uri: REDDIT_CALLBACK_URL
		}
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		var base64encodedData = new Buffer.from(REDDIT_CLIENT_ID + ':' + REDDIT_CLIENT_SECRET).toString('base64');
		fetch(url.toString(), {
			method:'POST',
			headers:{
				'Authorization': 'Basic ' + base64encodedData,
				'Content-Type': "application/x-www-form-urlencoded",
				'user-agent': 'TechServicesAnalytics@mx.uillinois.edu testing various things v0.1',
			},
		}).then(function(response){
			return response.json();
		}).then(function(json){
			if ('error' in json){
				res.send({ERROR: JSON.stringify(json)});
			}
			else{
				setCredential(req, 'rd_access_token', json['access_token']);
				res.redirect("/query");
			}
		});
	}
	else{
		res.send({ERROR: "State does not match. Auth failed!"})
	}
});

module.exports = router;
