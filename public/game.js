class Game {
	canvas = undefined;
	ctx = undefined;
	
	tile_size = 64;
	line_size = 2;
	width = 0;
	height = 0;
	board = undefined;
	pieces = [];
	input_handler = undefined;
	moving_piece = -1;
	mouseover_piece = -1;
	currently_occupied_spaces = {black: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 
	                             white: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]};
	piece_indices = {black: {indices: [], pawn: [], rook: [], bishop: [], queen: [], king: [], queenside_rook: [], kingside_rook: []}, 
					 white: {indices: [], pawn: [], rook: [], bishop: [], queen: [], king: [], queenside_rook: [], kingside_rook: []}};
	enpassantable_piece = {black: -1, white: -1, black_index: -1, white_index: -1};
	checked_kings = {black: false, white: false};
	checkmate = {black: false, white: false};
	castle = {black: {queenside: false, kingside: false}, white: {queenside: false, kingside: false}};
	saved_fake_move = {piece_index: -1, saved_linear_pos: -1, pepsied: -1};
	black_turn = false;
	debug = {draw: false, disable_turns: false, rando_flag: false};
	selecting_piece = {bool: false, black: true, index: -1, selection: 'none'};
	selecting_color = {bool: true, selection: 'none'};
	connected = false;
	//current_animation_frame = undefined;
	player_black = false;
	server_making_move = false;
	one_dimension = false;
	
	constructor() {
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.line_size = 2;
		this.tile_size = 64;
		if(!this.one_dimension) {
			this.width = this.line_size*9 + this.tile_size*8;
			this.height = this.width;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
		} else {
			this.width = this.line_size*65 + this.tile_size*64;
			this.height = this.line_size*2 + this.tile_size;
			this.canvas.width = this.width;
			this.canvas.height = this.height;			
		}
		this.enableSharpening();
		
		this.board = new Board(this);
		this.resetBoard();
		
		this.input_handler = new InputHandler(this); 
		this.piece_select_screen = new PieceSelectScreen(this);
		this.color_select_screen = new ColorSelectScreen(this);
		this.current_turn_gui = new CurrentTurnGUI(this);
		
		this.socket_handler = new SocketHandler(this);
		
		this.loop = this.loop.bind(this);
		window.requestAnimationFrame(this.loop);
	}
	
	loop() {
		if (!this.connected) {
			this.draw();
			this.color_select_screen.connectionDraw();
			this.current_animation_frame = window.requestAnimationFrame(this.loop);
			return;
		}
		if (this.selecting_color.bool) {
			this.handleColorQueue();
			this.draw();
			this.color_select_screen.draw();
			if(this.selecting_color.selection != 'none') {
				if(this.selecting_color.selection == 'black') {
					this.player_black = true;
					this.resetBoard();
				} else {
					this.player_black = false;
				}
				this.selecting_color.selection = 'none';
				this.socket_handler.sendColorSelection(this.player_black);
				this.selecting_color.bool = false;
			} else {
				this.current_animation_frame = window.requestAnimationFrame(this.loop);
				return;
			}
		}
		if(this.selecting_piece.bool) {
			this.handleSelectQueue();
			this.draw();
			this.piece_select_screen.draw(this.selecting_piece.black);
			if(this.selecting_piece.selection != 'none') {
				this.spawnSelectPiece();
				this.draw();
			}
			return;
		}
		this.handleInputQueue();
		this.draw();
		if(this.checkmate.black) {
			this.printLScreen(true);
			return;
		} else if(this.checkmate.white) {
			this.printLScreen(false);
			return;
		}
	}
	
	handleColorQueue() {
		while(1) {
			if(this.input_handler.que.length == 0) {
				return;
			}
			if(this.input_handler.que[0].type == "mousedown") {
				this.color_select_screen.collide(this.input_handler.que[0].pos, this.input_handler.que[0].type);
				this.input_handler.que.shift();
			} else if(this.input_handler.que[0].type == "mouseup") {
				this.selecting_color.selection = this.color_select_screen.collide(this.input_handler.que[0].pos, this.input_handler.que[0].type);
				this.input_handler.que.shift();
			} else if (this.input_handler.que[0].type == "delta") {
				this.color_select_screen.collide(this.input_handler.que[0].pos, 'mouseover');
				this.input_handler.que.shift();
			} else if(this.input_handler.que[0].type == "mouseover") {
				this.color_select_screen.collide(this.input_handler.que[0].pos, this.input_handler.que[0].type);
				this.input_handler.que.shift()
			} 
		}
	}
	
	handleSelectQueue() {
		while(1) {
			if(this.input_handler.que.length == 0) {
				return;
			}
			if(this.input_handler.que[0].type == "mousedown") {
				this.piece_select_screen.collide(this.input_handler.que[0].pos, this.input_handler.que[0].type);
				this.input_handler.que.shift();
			} else if(this.input_handler.que[0].type == "mouseup") {
				this.selecting_piece.selection = this.piece_select_screen.collide(this.input_handler.que[0].pos, this.input_handler.que[0].type);
				this.input_handler.que.shift();
			} else if (this.input_handler.que[0].type == "delta") {
				this.piece_select_screen.collide(this.input_handler.que[0].pos, 'mouseover');
				this.input_handler.que.shift();
			} else if(this.input_handler.que[0].type == "mouseover") {
				this.piece_select_screen.collide(this.input_handler.que[0].pos, this.input_handler.que[0].type);
				this.input_handler.que.shift()
			} 
		}
	}
	
	spawnSelectPiece() {
		//kill pawn
		this.pieces[this.selecting_piece.index].pepsi = true;
		//spawn new piece
		if(this.selecting_piece.selection == "rook") {
			this.pieces.push(new Rook(this, this.selecting_piece.black, this.pieces[this.selecting_piece.index].space.grid.x, this.pieces[this.selecting_piece.index].space.grid.y, false));
			this.pieces[this.pieces.length-1].kingside = false;
		} else if(this.selecting_piece.selection == "bishop") {
			this.pieces.push(new Bishop(this, this.selecting_piece.black, this.pieces[this.selecting_piece.index].space.grid.x, this.pieces[this.selecting_piece.index].space.grid.y));
		} else if(this.selecting_piece.selection == "knight") {
			this.pieces.push(new Knight(this, this.selecting_piece.black, this.pieces[this.selecting_piece.index].space.grid.x, this.pieces[this.selecting_piece.index].space.grid.y));
		} else if(this.selecting_piece.selection == "queen") {
			this.pieces.push(new Queen(this, this.selecting_piece.black, this.pieces[this.selecting_piece.index].space.grid.x, this.pieces[this.selecting_piece.index].space.grid.y));
		}
		//clean up
		var pos = {x: this.pieces[this.selecting_piece.index].x, y: this.pieces[this.selecting_piece.index].y};
		this.selecting_piece = {bool: false, black: true, index: -1, selection: 'none'};
		this.moving_piece = this.pieces.length-1;
		this.indexPieces();
		//place piece to run update loops and such
		this.update();
		this.moving_piece = -1;
	}
	
	handleInputQueue() {
		if(this.input_handler.que.length == 0) {
			return;
		}
		//if piece moving
		while(1) {
			if(this.input_handler.que.length == 0) {
				return;
			}
			if(this.input_handler.que[0].type == "mousedown") {
				this.checkClickedPiece(this.input_handler.que[0].pos);
				this.input_handler.que.shift();
			} else if(this.input_handler.que[0].type == "mouseup") {
				if(this.moving_piece == -1) {
					this.input_handler.que.shift();
				} else {
					this.placePiece(this.input_handler.que[0].pos);
					this.moving_piece = -1;
					this.input_handler.que.shift();
				}
			} else if (this.input_handler.que[0].type == "delta") {
				if(this.moving_piece == -1) {
					this.input_handler.que.shift();
				} else {
					this.pieces[this.moving_piece].move(this.input_handler.que[0].delta);
					this.input_handler.que.shift();
				}
			} else if(this.input_handler.que[0].type == "mouseover") {
				if(this.moving_piece != -1) {
					this.input_handler.que.shift();
				} else {
					this.checkMouseoverPiece(this.input_handler.que[0].pos);
					this.input_handler.que.shift();
				}
			} 
		}
	}
	
	checkEndgame() {
		//check check for black
		this.checkCheck(true);
		if(this.checked_kings.black) {
			if(this.checkCheckmate(true)) {
				this.checkmate.black = true;
			}
		}
		//check check for white
		this.checkCheck(false);
		if(this.checked_kings.white) {
			if(this.checkCheckmate(false)) {
				this.checkmate.white = true;
			}
		}
	}
	
	checkCheck(black=false) {
		const king_space = this.pieces[this.piece_indices[black?"black":"white"].king[0]].space.linear;
		this.pieces[this.piece_indices[black?"black":"white"].king[0]].checked = false;
		this.checked_kings[black?"black":"white"] = false;
		const enemy_indices = this.piece_indices[black?"white":"black"].indices;
		for (const i of enemy_indices) {
			if(this.pieces[i].kill_moves.includes(king_space)) {
				this.pieces[this.piece_indices[black?"black":"white"].king[0]].checked = true;
				this.checked_kings[black?"black":"white"] = true;
			}
		}
	}
	
	
	//returns true if checkmate
	checkCheckmate(black=false) {
		for(const i of this.piece_indices[black?"black":"white"].indices) {
			for(const move of this.pieces[i].valid_moves) {
				this._fakeMove(i, move);
				if(!this.checked_kings[black?"black":"white"]) {
					this._undoFakeMove();
					return false;
				}
				this._undoFakeMove();
			}
		}
		return true;
	}
	
	//used privately for checking checkmates and maybe other stuff
	//the calling function must call undo move after
	//can probably also be used for checking illegal moves and such
	_fakeMove(piece_index, linear_pos) {
		if(this.saved_fake_move.piece_index != -1 || this.saved_fake_move.saved_linear_pos != -1) {
			console.log("AAAAAAAHHHHHHHHHHHH, DIDNT CLEAN UP LAST FAKE MOVE!");
			alert("AAAAAAAHHHHHHHHHHHHH");
		}
		this.saved_fake_move.piece_index = piece_index;
		this.saved_fake_move.saved_linear_pos = this.pieces[piece_index].space.linear;
		this.pieces[piece_index].space.linear = linear_pos;
		//does that kill a piece?
		if(this.pieces[piece_index].kill_moves.includes(linear_pos)) {
			var ded_piece = this.getKilledPieceIndex(this.pieces[piece_index].black, linear_pos);
			if(ded_piece == -1) {
				console.log('simulated move to kill space but no killable piece found');
				throw new Error("AH");
			} else {			
				this.pieces[ded_piece].pepsi = true;
				this.saved_fake_move.pepsied = ded_piece;
			}
		}
		this.generateLinearPosLists();
		this.updateValidMoves();
		this.checkCheck(false);
		this.checkCheck(true);
	}
	
	_undoFakeMove() {
		this.pieces[this.saved_fake_move.piece_index].space.linear = this.saved_fake_move.saved_linear_pos;
		if(this.saved_fake_move.pepsied != -1) {
			this.pieces[this.saved_fake_move.pepsied].pepsi = false;
		}
		this.generateLinearPosLists();
		this.updateValidMoves();
		this.checkCheck(false);
		this.checkCheck(true);
		this.saved_fake_move.piece_index = -1;
		this.saved_fake_move.saved_linear_pos = -1;
		this.saved_fake_move.pepsied = -1;
	}
	
	getKilledPieceIndex(black, linear_pos) {
		const enemy_indices = this.piece_indices[black?'white':'black'].indices;
		for (const i of enemy_indices) {
			if(this.pieces[i].pepsi) continue;
			if(this.pieces[i].space.linear == linear_pos) {
				return i;
			}
		}
		//check enpassantable piece
		if(this.enpassantable_piece[black?'white':'black'] == -1) {
			return -1;
		} else {
			if(black) {
				if(this.pieces[this.enpassantable_piece.white_index].space.linear == linear_pos-8) {
					return this.enpassantable_piece.white_index;
				}
			} else {
				if(this.pieces[this.enpassantable_piece.black_index].space.linear == linear_pos+8) {
					return this.enpassantable_piece.black_index;
				}
			}
		}
		return -1;
	}
	
	placePiece(pos) {
		if(this.pieces[this.moving_piece].black^this.player_black != this.black_turn && !this.debug.disable_turns) {
			this.pieces[this.moving_piece].resetSpace();
			return;
		}
		if(pos.x == undefined) {
			var new_space = this.linearToGrid(pos);
			new_space.linear = pos;
		} else {
			var new_space = this.screenToGridSpace(pos.x, pos.y);
		}
		if(this.pieces[this.moving_piece].validateMove(new_space)) {
			//first check if that moves checks the player by faking the move
			this._fakeMove(this.moving_piece, new_space.linear);
			if(this.checked_kings[this.pieces[this.moving_piece].black?"black":"white"]) {
				//illegal, that move checks the movers king
				this._undoFakeMove();
				this.pieces[this.moving_piece].resetSpace();
				return;
			}
			this._undoFakeMove();
			//can move there
			for (const piece of this.pieces) {
				piece.enpassantable = false;
			}
			this.pieces[this.moving_piece].setSpace(new_space.linear);
			//does that kill a piece?
			if(this.pieces[this.moving_piece].kill_moves.includes(new_space.linear)) {
				var ded_piece = this.getKilledPieceIndex(this.pieces[this.moving_piece].black, new_space.linear);
				if(ded_piece == -1) {
					console.log('moved to kill space but no killable piece found');
				} else {			
					this.pieces[ded_piece].pepsi = true;
				}
			}
			//was that a castle?
			if(this.pieces[this.moving_piece].type == 'king' && this.pieces[this.moving_piece].castle_moves.includes(new_space.linear)) {
				if(this.player_black) {
					//kingside white
					if(new_space.linear == 1) this.pieces[this.piece_indices.black.kingside_rook[0]].setSpace(new_space.linear+1);
					//queenside white
					else if(new_space.linear == 5) this.pieces[this.piece_indices.black.queenside_rook[0]].setSpace(new_space.linear-1);
					//kingside black
					else if(new_space.linear == 57) this.pieces[this.piece_indices.white.kingside_rook[0]].setSpace(new_space.linear+1);
					//queenside black
					else if(new_space.linear == 61) this.pieces[this.piece_indices.white.queenside_rook[0]].setSpace(new_space.linear-1);
				} else {
					//queenside black
					if(new_space.linear == 2) this.pieces[this.piece_indices.black.queenside_rook[0]].setSpace(new_space.linear+1);
					//kingside black
					else if(new_space.linear == 6) this.pieces[this.piece_indices.black.kingside_rook[0]].setSpace(new_space.linear-1);
					//queenside white
					else if(new_space.linear == 58) this.pieces[this.piece_indices.white.queenside_rook[0]].setSpace(new_space.linear+1);
					//kingside white
					else if(new_space.linear == 62) this.pieces[this.piece_indices.white.kingside_rook[0]].setSpace(new_space.linear-1);
				}
			}
			//was that a pawn to edge?
			if(this.pieces[this.moving_piece].type == 'pawn') {
				if(this.pieces[this.moving_piece].black && new_space.linear >= 56 && new_space.linear <= 63) {
					//change pawn to something else
					this.selecting_piece.black = this.pieces[this.moving_piece].black;
					this.selecting_piece.index = this.moving_piece;
					this.selecting_piece.bool = true;
					return;
				} else if(!this.pieces[this.moving_piece].black && new_space.linear >= 0 && new_space.linear <= 7) {
					//change pawn to something else
					this.selecting_piece.black = this.pieces[this.moving_piece].black;
					this.selecting_piece.index = this.moving_piece;
					this.selecting_piece.bool = true;
					return;
				}
			}
			//update board and infographics
			this.update();
			if(!this.server_making_move && !this.selecting_piece.bool) {
				this.socket_handler.sendMove(this.moving_piece, new_space.linear);
			}
		} else {
			//cannot move there
			this.pieces[this.moving_piece].resetSpace();
		}
	}
	
	update() {
		this.generateLinearPosLists();
		this.updateValidMoves();
		this.illegalPrune();
		this.checkEndgame();
		this.checkCastling();
		this.black_turn = !this.black_turn;
	}
	
	checkCastling() {
		this.castleBuildingPermit(false);
		this.castleBuildingPermit(true);
	}
	
	castleBuildingPermit(black) {
		//Revoke castle building permits till we go through our OSHA handbook of castling rules.
		this.castle[black?'black':'white'].queenside = false;
		this.castle[black?'black':'white'].kingside = false;
		this.pieces[this.piece_indices[black?'black':'white'].king[0]].castle_moves = [];
		//1. The king is not currently in check.
		if(this.checked_kings[black?'black':'white']) return;
		//2. Neither the king nor the rook has previously moved and the rooks arent dead.
		if(this.pieces[this.piece_indices[black?'black':'white'].king[0]].first_move_made) return;
		const rooks = this.piece_indices[black?'black':'white'].rook;
		var queenside_rook_viable = false;
		var kingside_rook_viable = false;
		for(const rook_index of rooks) {
			if(this.pieces[rook_index].queenside && !this.pieces[rook_index].pepsi && !this.pieces[rook_index].first_move_made) {
				queenside_rook_viable = true;
			} else if(!this.pieces[rook_index].queenside && !this.pieces[rook_index].pepsi && !this.pieces[rook_index].first_move_made) {
				kingside_rook_viable = true;
			}
		}
		if(!queenside_rook_viable && !kingside_rook_viable) return;
		//3. There are no pieces between the king and the rook.
		const all_cur_positions = this.currently_occupied_spaces.white.concat(this.currently_occupied_spaces.black);
		if(queenside_rook_viable) {
			queenside_rook_viable = false;
			if(this.player_black) {
				if(black && !all_cur_positions.includes(4) && !all_cur_positions.includes(5) && !all_cur_positions.includes(6)) {
					queenside_rook_viable = true;
				} else if (!black && !all_cur_positions.includes(60) && !all_cur_positions.includes(61) && !all_cur_positions.includes(62)) {
					queenside_rook_viable = true;
				}
			} else {
				if(black && !all_cur_positions.includes(1) && !all_cur_positions.includes(2) && !all_cur_positions.includes(3)) {
					queenside_rook_viable = true;
				} else if (!black && !all_cur_positions.includes(57) && !all_cur_positions.includes(58) && !all_cur_positions.includes(59)) {
					queenside_rook_viable = true;
				}
			}
		}
		if(kingside_rook_viable) {
			kingside_rook_viable = false;
			if(this.player_black) {
				if(black && !all_cur_positions.includes(1) && !all_cur_positions.includes(2)) {
					kingside_rook_viable = true;
				} else if (!black && !all_cur_positions.includes(57) && !all_cur_positions.includes(58)) {
					kingside_rook_viable = true;
				}
			} else {
				if(black && !all_cur_positions.includes(5) && !all_cur_positions.includes(6)) {
					kingside_rook_viable = true;
				} else if (!black && !all_cur_positions.includes(61) && !all_cur_positions.includes(62)) {
					kingside_rook_viable = true;
				}
			}
		}
		if(!queenside_rook_viable && !kingside_rook_viable) return;
		//4. The king does not pass through or finish on a square that is attacked by an enemy piece.
		if(queenside_rook_viable) {
			if(this.player_black) {
				if(black) {
					for (const ind of this.piece_indices.white.indices) {
						if(this.pieces[ind].kill_moves.includes(4) || this.pieces[ind].kill_moves.includes(5)) {
							queenside_rook_viable = false;
							break;
						}
					}
				} else {
					for (const ind of this.piece_indices.black.indices) {
						if(this.pieces[ind].kill_moves.includes(60) || this.pieces[ind].kill_moves.includes(61)) {
							queenside_rook_viable = false;
							break;
						}
					}
				}
			} else {
				if(black) {
					for (const ind of this.piece_indices.white.indices) {
						if(this.pieces[ind].kill_moves.includes(2) || this.pieces[ind].kill_moves.includes(3)) {
							queenside_rook_viable = false;
							break;
						}
					}
				} else {
					for (const ind of this.piece_indices.black.indices) {
						if(this.pieces[ind].kill_moves.includes(58) || this.pieces[ind].kill_moves.includes(59)) {
							queenside_rook_viable = false;
							break;
						}
					}
				}
			}
		}
		if(this.player_black) {
			if(kingside_rook_viable) {
				if(black) {
					for (const ind of this.piece_indices.white.indices) {
						if(this.pieces[ind].kill_moves.includes(1) || this.pieces[ind].kill_moves.includes(2)) {
							kingside_rook_viable = false;
							break;
						}
					}
				} else {
					for (const ind of this.piece_indices.black.indices) {
						if(this.pieces[ind].kill_moves.includes(58) || this.pieces[ind].kill_moves.includes(57)) {
							kingside_rook_viable = false;
							break;
						}
					}
				}
			}
		} else {
			if(kingside_rook_viable) {
				if(black) {
					for (const ind of this.piece_indices.white.indices) {
						if(this.pieces[ind].kill_moves.includes(5) || this.pieces[ind].kill_moves.includes(6)) {
							kingside_rook_viable = false;
							break;
						}
					}
				} else {
					for (const ind of this.piece_indices.black.indices) {
						if(this.pieces[ind].kill_moves.includes(61) || this.pieces[ind].kill_moves.includes(62)) {
							kingside_rook_viable = false;
							break;
						}
					}
				}
			}
		}
		if(queenside_rook_viable) {
			this.castle[black?'black':'white'].queenside = true;
			if(this.player_black) {
				if(black) {
					this.pieces[this.piece_indices.black.king[0]].valid_moves.push(5);
					this.pieces[this.piece_indices.black.king[0]].castle_moves.push(5);
				} else {
					this.pieces[this.piece_indices.white.king[0]].valid_moves.push(61);
					this.pieces[this.piece_indices.white.king[0]].castle_moves.push(61);
				}
			} else {
				if(black) {
					this.pieces[this.piece_indices.black.king[0]].valid_moves.push(2);
					this.pieces[this.piece_indices.black.king[0]].castle_moves.push(2);
				} else {
					this.pieces[this.piece_indices.white.king[0]].valid_moves.push(58);
					this.pieces[this.piece_indices.white.king[0]].castle_moves.push(58);
				}
			}
		}
		if(kingside_rook_viable) {
			this.castle[black?'black':'white'].kingside = true;
			if(this.player_black) {
				if(black) {
					this.pieces[this.piece_indices.black.king[0]].valid_moves.push(1);
					this.pieces[this.piece_indices.black.king[0]].castle_moves.push(1);
				} else {
					this.pieces[this.piece_indices.white.king[0]].valid_moves.push(57);
					this.pieces[this.piece_indices.white.king[0]].castle_moves.push(57);
				}
			} else {
				if(black) {
					this.pieces[this.piece_indices.black.king[0]].valid_moves.push(6);
					this.pieces[this.piece_indices.black.king[0]].castle_moves.push(6);
				} else {
					this.pieces[this.piece_indices.white.king[0]].valid_moves.push(62);
					this.pieces[this.piece_indices.white.king[0]].castle_moves.push(62);
				}
			}
		}
	}
	
	illegalPrune() {
		//first build illegal move lists for each piece
		//cant prune during search or it will ruin the for loops
		for(const i of this.piece_indices.black.indices) {
			this.pieces[i].illegal_moves = [];
			for(var j = 0; j < this.pieces[i].valid_moves.length; j++) {
				this._fakeMove(i, this.pieces[i].valid_moves[j]);
				if(this.checked_kings.black) {
					this._undoFakeMove();
					this.pieces[i].illegal_moves.push(this.pieces[i].valid_moves[j]);
				} else {
					this._undoFakeMove();
				}
			}
		}
		for(const i of this.piece_indices.white.indices) {
			this.pieces[i].illegal_moves = [];
			for(var j = 0; j < this.pieces[i].valid_moves.length; j++) {
				this._fakeMove(i, this.pieces[i].valid_moves[j]);
				if(this.checked_kings.white) {
					this._undoFakeMove();
					this.pieces[i].illegal_moves.push(this.pieces[i].valid_moves[j]);
				} else {
					this._undoFakeMove();
				}
			}
		}
		//now prune them out
		for (const piece of this.pieces) {
			piece.pruneIllegalMoves();
		}
	}
	
	updateValidMoves() {
		for (const piece of this.pieces) {
			piece.generateValidMoves();
		}
	}
	
	indexPieces() {
		this.piece_indices.black.indices = [];
		this.piece_indices.black.pawn = [];
		this.piece_indices.black.rook = [];
		this.piece_indices.black.knight = [];
		this.piece_indices.black.bishop = [];
		this.piece_indices.black.queen = [];
		this.piece_indices.black.king = [];
		this.piece_indices.black.queenside_rook = [];
		this.piece_indices.black.kingside_rook = [];
		
		this.piece_indices.white.indices = [];
		this.piece_indices.white.pawn = [];
		this.piece_indices.white.rook = [];
		this.piece_indices.white.knight = [];
		this.piece_indices.white.bishop = [];
		this.piece_indices.white.queen = [];
		this.piece_indices.white.king = [];
		this.piece_indices.white.queenside_rook = [];
		this.piece_indices.white.kingside_rook = [];
		
		for (let i = 0; i < this.pieces.length; i++) {
			if(!this.pieces[i].pepsi) {
				if(this.pieces[i].black) {
					this.piece_indices.black.indices.push(i);
					this.piece_indices.black[this.pieces[i].type].push(i);
					if(this.pieces[i].type == 'rook' && this.pieces[i].queenside) {
						this.piece_indices.black.queenside_rook.push(i);
					} else if (this.pieces[i].type == 'rook' && this.pieces[i].kingside) {
						this.piece_indices.black.kingside_rook.push(i);
					}
				} else {
					this.piece_indices.white.indices.push(i);
					this.piece_indices.white[this.pieces[i].type].push(i);
					if(this.pieces[i].type == 'rook' && this.pieces[i].queenside) {
						this.piece_indices.white.queenside_rook.push(i);
					} else if (this.pieces[i].type == 'rook' && this.pieces[i].kingside) {
						this.piece_indices.white.kingside_rook.push(i);
					}
				}
			}
		}
	}
	
	generateLinearPosLists() {
		this.currently_occupied_spaces.black = [];
		this.currently_occupied_spaces.white = [];
		this.enpassantable_piece.black = -1;
		this.enpassantable_piece.white = -1;
		this.enpassantable_piece.black_index = -1;
		this.enpassantable_piece.white_index = -1;
		for (var i = 0; i < this.pieces.length; i++) {
			const piece = this.pieces[i];
			if(!piece.pepsi) {
				if(piece.black) {
					this.currently_occupied_spaces.black.push(piece.space.linear);
					if(piece.enpassantable) {
						this.enpassantable_piece.black = piece.space.linear;
						this.enpassantable_piece.black_index = i;
					}
				} else {
					this.currently_occupied_spaces.white.push(piece.space.linear);
					if(piece.enpassantable) {
						this.enpassantable_piece.white = piece.space.linear;
						this.enpassantable_piece.white_index = i;
					}
				}
			}
		}
	}
	
	pieceIndexFromLinearPos(linear_pos) {
		for (var i = 0; i < this.pieces.length; i++) {
			if(this.pieces[i].space.linear == linear_pos) {
				return i;
			}
		}
		return -1;
	}
	
	checkMouseoverPiece(pos) {
		this.mouseover_piece = -1;
		for(var i = 0; i < this.pieces.length; i++) {
			if(this.pieces[i].collide(pos.x, pos.y, i)) {
				this.mouseover_piece = i;
				break;
			}
		}
	}
	
	checkClickedPiece(pos) {
		if(!this.player_black) {
			var start = 0;
			var stop = 16;
		} else {
			var start = 16;
			var stop = 32;
		}
		for(var i = start; i < stop; i++) {
			if(this.pieces[i].collide(pos.x, pos.y, i)) {
				this.moving_piece = i;
				break;
			}
		}
	}
	
	screenToGridSpace(x, y) {
		var o = {grid: {x: 0, y:0}, linear: 0};
		o.grid.x = Math.floor((x-this.line_size)/(this.line_size+this.tile_size));
		o.grid.y = Math.floor((y-this.line_size)/(this.line_size+this.tile_size));
		o.linear = this.gridToLinear(o.grid.x, o.grid.y);
		return o;
	}
	
	gridToLinear(x, y) {
		return y*8 + x;
	}
	
	linearToGrid(l) {
		return {x: this.mod(l,8), y: Math.floor(l/8)};
	}
	
	resetBoard() {
		this.pieces = [];
		if(this.player_black) {
			this.addPieces(true);
			this.addPieces(false);
		} else {
			this.addPieces(false);
			this.addPieces(true);
		}
		this.updateValidMoves();
		this.indexPieces();
	}
	
	addPieces(black) {
		var y = 0;
		if(black) {
			y = 1;
		} else {
			y = 6;
		}
		if(!this.player_black) {
			for(let i = 0; i<8; i++) {
				this.pieces.push(new Pawn(this, black, i, y));
			}
		} else {
			for(let i = 7; i>=0; i--) {
				this.pieces.push(new Pawn(this, black, i, y));
			}
		}
		if(black) {
			y = 0;
		} else {
			y = 7;
		}
		if(!this.player_black) {
			this.pieces.push(new Rook(this, black, 0, y, true));
			this.pieces.push(new Rook(this, black, 7, y, false));
		} else {
			this.pieces.push(new Rook(this, black, 7, y, true));
			this.pieces.push(new Rook(this, black, 0, y, false));
		}
		if(!this.player_black) {
			this.pieces.push(new Knight(this, black, 1, y));
			this.pieces.push(new Knight(this, black, 6, y));
			this.pieces.push(new Bishop(this, black, 2, y));
			this.pieces.push(new Bishop(this, black, 5, y));
		} else {
			this.pieces.push(new Knight(this, black, 6, y));
			this.pieces.push(new Knight(this, black, 1, y));
			this.pieces.push(new Bishop(this, black, 5, y));
			this.pieces.push(new Bishop(this, black, 2, y));
		}
		if(!this.player_black) {
			this.pieces.push(new Queen(this, black, 3, y));
			this.pieces.push(new King(this, black, 4, y));
		} else {
			this.pieces.push(new Queen(this, black, 4, y));
			this.pieces.push(new King(this, black, 3, y));
		}
	}
	
	draw() {
		this.board.draw();
		if(this.debug.draw) {
			this.board.debugDraw();
		}
		if(this.moving_piece != -1 || this.mouseover_piece != -1) {
			this.pieces[this.moving_piece>this.mouseover_piece?this.moving_piece:this.mouseover_piece].drawMoves();
		}
		for (var i = 0; i < this.pieces.length; i++) {
			this.pieces[i].draw();
		}
		this.current_turn_gui.draw();
	}
	
	printLScreen(black) {
		this.ctx.save();
		this.ctx.fillStyle = "#70706ebb";
		this.ctx.fillRect(this.width/4, this.height/3, this.width/2, this.height/3);
		
		this.ctx.font = "32px serif";
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = 'white';
		if(this.player_black) {
			var win_text = black?"Black Won.":"White Won."
		} else {
			var win_text = black?"White Won.":"Black Won.";
		}
		this.ctx.fillText(black?"White Won.":"Black Won.", this.width/2, this.height/2);
		this.ctx.restore();
	}
	
	enableSharpening(canvas) {
		const dpr = window.devicePixelRatio;
		const rect = this.ctx.canvas.getBoundingClientRect();
		
		this.ctx.canvas.width = rect.width * dpr;
		this.ctx.canvas.height = rect.height * dpr;
		
		this.ctx.scale(dpr,dpr);
		
		this.ctx.canvas.style.width = `${rect.width}px`;
		this.ctx.canvas.style.height = `${rect.height}px`;
	}
	
	mod(n, m) {
		return ((n%m)+m)%m;
	}
}