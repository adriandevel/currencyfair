module.exports = function(io) {

    io.sockets.on('connection', function (socket) {
    	console.log('Socket Connected!')

        socket.on('disconnect', function(){
			console.log('user disconnected');
		});
    });
};