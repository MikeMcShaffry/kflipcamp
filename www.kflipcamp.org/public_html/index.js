// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('.')(server);
var port = process.env.PORT || 3000;

let motd = '';

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/controllers', express.static(path.join(__dirname, 'public/controllers')));

// Chatroom

var numUsers = 0;

function whoCommand(socket) {
	let users = 0;
	let lurkers = 0;
	let list = 'Participants: ';
	
	let keys = Object.keys(io.sockets.sockets);
	
	keys.forEach(function(key) {		
		let connected_socket = io.sockets.sockets[key];
				
		if (connected_socket.username) {
			if (users > 0) {
				list += ', ';
			}
			list += connected_socket.username;
			if (connected_socket.admin) {
				list += ' (admin)';
			}
			++users;
		}
		else {
			++lurkers;
		}
	});
	
	if (lurkers > 0) {
		if (users > 0) {
			list += ' and ';
		}
		if (lurkers === 1) {
			list += ' one spectator.';
		}
		else {
			list += ` ${lurkers} spectators.`; 
		}
	}
	
	socket.emit('new message', { 
      username: '',
      message: list
    });	
}

function helpCommand(socket) {
	let commands = 'Commands are /who, /help';
	if (socket.admin) {
		commands += ' /setmotd';
	}
	
	socket.emit('new message', { 
      username: '',
      message: commands
    });	
}

function setMotdCommand(socket, data) {
	// remove '/setmotd ' 
	motd = data.substr(9);
	
	// we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: 'ANNOUNCEMENT!',
      message: motd
    });	
	socket.emit('new message', {
		username: '', 
		message: 'You have set the message of the day to ' + motd 
	});
	console.log(`${socket.username} just set the message of the day to ${motd}`);
}

io.on('connection', (socket) => {
  var addedUser = false;
  
  console.log('Someone connected');
  
  if (motd) {
	socket.emit('new message', {
	  username: 'ANNOUNCEMENT!',
	  message: motd
	});  	  
  }
  
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
	  
	if (data[0] === '/') {

		  // check for a command
		if (data === '/who') {
			whoCommand(socket);
			return;
		}
		else if (data === '/help') {
			helpCommand(socket);
			return;
		}
		else if (data === '/RaspberryCider') {
			socket['admin'] = true;
			socket.emit('new message', { 
			  username: '',
			  message: 'You have admin privs now. Don\'t let it go to your head.'
			});
			console.log(`${socket.username} just elevated to admin privs`);			
			
			return;
		}
		else if (socket.admin) {
			if (data.startsWith('/setmotd ')) {
				setMotdCommand(socket, data);
				return;
			}
		}
		
		socket.emit('new message', { 
		  username: '',
		  message: 'that command is not recognized.'
		});			
		return;
	}
	
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username.substr(0, 20);
	console.log(socket.username + ' just logged in');
	
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
