var express = require('express');
var router = express.Router();

/* GET handler*/
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Currency Fair' });
});


// POST handler
router.post('/', function(req, res, next) {
	res.setHeader('Content-Type', 'text/html');

	// add log to redis and emit message to the frontend to show the raw log
	if(req.body.securityToken == 'currencyfair'){
		redis_client1.lpush('logs', JSON.stringify(req.body.log));
		io.sockets.emit('raw-message', JSON.stringify(req.body.log));
	}
	res.send({response: 'ok'});    // echo the result back
});

module.exports = router;
