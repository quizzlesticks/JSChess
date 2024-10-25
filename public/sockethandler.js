class SocketHandler {
	constructor(game) {
		this.game = game;
		this.socket = io();
		
		this.connect = this.connect.bind(this);
		this.socket.on('connection', this.connect);
		
		this.otherPlayerColorSelect = this.otherPlayerColorSelect.bind(this);
		this.socket.on('player_color_select', this.otherPlayerColorSelect);
		
		this.otherPlayerDisconnect = this.otherPlayerDisconnect.bind(this);
		this.socket.on('player_disconnect', this.otherPlayerDisconnect);
		
		this.receiveMove = this.receiveMove.bind(this);
		this.socket.on('move', this.receiveMove);
		
		this.serverMakeMoves = this.serverMakeMoves.bind(this);
		this.socket.on('all_previous_moves', this.serverMakeMoves);
	}
	
	connect(already_selected_colors, moves) {
		this.game.color_select_screen.already_selected = already_selected_colors;
		this.game.connected = true;
	}
	
	otherPlayerColorSelect(already_selected_colors) {
		this.game.color_select_screen.already_selected = already_selected_colors;
	}
	
	otherPlayerDisconnect(already_selected_colors) {
		this.game.color_select_screen.already_selected = already_selected_colors;
	}
	
	sendColorSelection(player_black) {
		this.socket.emit('color_selection', player_black);
	}
	
	sendMove(piece_index, linear_pos) {
		if(this.game.player_black) {
			linear_pos = 63-linear_pos;
		}
		this.socket.emit('sendMove', piece_index, linear_pos);
	}
	
	receiveMove(piece_index, linear_pos) {
		if(this.game.moving_piece != -1) {
			this.game.pieces[this.game.moving_piece].resetSpace();
		}
		if(this.game.player_black) {
			linear_pos = 63-linear_pos;
		}
		this.game.server_making_move = true;
		this.game.moving_piece = piece_index;
		this.game.placePiece(linear_pos);
		this.game.server_making_move = false;
		this.game.moving_piece = -1;
		this.game.draw();
	}
	
	serverMakeMoves(moves) {
		if(this.game.moving_piece != -1) {
			this.game.pieces[this.game.moving_piece].resetSpace();
		}
		var linear_pos = 0;
		this.game.server_making_move = true;
		for(var i = 0; i < moves.pos.length; i++) {
			this.game.moving_piece = moves.indices[i];
			if(this.game.player_black) {
				linear_pos = 63-moves.pos[i];
			} else {
				linear_pos = moves.pos[i];
			}
			this.game.placePiece(linear_pos);
		}
		this.game.server_making_move = false;
		this.game.moving_piece = -1;
		this.game.draw();
	}
}