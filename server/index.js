const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname + '/../public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

const already_selected_color = {white: false, black: false};
const moves = {indices: [], pos: [], piece_select: []};

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.emit('connection', already_selected_color);
	
	socket.on('disconnect', () => {
		console.log('user disconnected');
		if(socket.player_black) {
			already_selected_color.black = false;
		} else {
			already_selected_color.white = false;
		}
		socket.broadcast.emit('player_disconnect', already_selected_color);
	});
	
	socket.on('color_selection', (player_black) => {
		console.log('Player selected color: ' + player_black);
		if(player_black) {
			already_selected_color.black = true;
		} else {
			already_selected_color.white = true;
		}
		socket.player_black = player_black;
		socket.broadcast.emit('player_color_select', already_selected_color);
		socket.emit('all_previous_moves', moves);
	});
	
	socket.on('sendMove', (piece_index, linear_pos) => {
		console.log("Got move: pieces[" + piece_index + "] to " + linear_pos);
		moves.indices.push(piece_index)
		moves.pos.push(linear_pos);
		moves.piece_select.push('none');
		socket.broadcast.emit('move', piece_index, linear_pos);
	});
	
	socket.on('send_piece_select', (piece_index, selection) => {
		console.log("Player made a " + selection + " out of a pawn.");
		//moves.indices.push(piece_index)
		//moves.pos.push(
	});
});

server.listen(3001);//, '172.29.175.244');