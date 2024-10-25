class Rook extends Piece {
	
	constructor(game, black, x, y, queenside) {
		super(game, black, x, y);
		this.preDraw();
		this.type = "rook";
		this.queenside = queenside;
		this.kingside = !queenside;
	}
	
	preDraw() {
		//head
		this.path.moveTo(20, 2);
		this.path.lineTo(22, 17);
		this.path.lineTo(44, 17);
		this.path.lineTo(46, 2);
		this.path.lineTo(40, 10);
		this.path.lineTo(36, 10);
		this.path.lineTo(33, 2);
		this.path.lineTo(30, 10);
		this.path.lineTo(26, 10);
		this.path.lineTo(20, 2);
		//small round under head
		this.path.roundRect(24, 18, 18, 3, [2, 2, 2, 2]);
		//big chunk
		this.path.moveTo(26, 22);
		this.path.lineTo(40, 22);
		this.path.lineTo(42, 42);
		this.path.lineTo(24, 42);
		this.path.lineTo(26, 22);
		//small round above base
		this.path.roundRect(20, 43, 26, 3, [2, 2, 2, 2]);
		//base
		//rounded section
		this.path.roundRect(17, 47, 32, 10, [3, 3, 0, 0]);
		//bottom rect
		this.path.rect(14, 58, 38, 4);
		
		this.stroke_path = this.path;
	}
	
	draw() {
		if (this.game.castle[this.black?'black':'white'][this.queenside?'queenside':'kingside'] && this.game.mouseover_piece == this.game.piece_indices[this.black?'black':'white'].king[0]) {
			this.piece_color = "#1724e366";
		} else {
			if(this.black^this.game.player_black) {
				this.piece_color = "black";
			} else {
				this.piece_color = "white";
			}
		}
		super.draw();
	}
	
	generateValidMoves() {
		if(this.black) {
			var nonvalid_moves = this.game.currently_occupied_spaces.black;
			var killable_moves = this.game.currently_occupied_spaces.white;
		} else {
			var nonvalid_moves = this.game.currently_occupied_spaces.white;
			var killable_moves = this.game.currently_occupied_spaces.black;
		}
		this.valid_moves = [];
		this.kill_moves = [];
		if(this.pepsi) return;
		//add upward moves
		var cur_linear_pos = this.space.linear;
		while(1) {
			cur_linear_pos -= 8;
			if(cur_linear_pos < 0) break;
			if(nonvalid_moves.includes(cur_linear_pos)) break;
			if(killable_moves.includes(cur_linear_pos)) {
				this.valid_moves.push(cur_linear_pos);
				this.kill_moves.push(cur_linear_pos);
				break;
			}
			this.valid_moves.push(cur_linear_pos);
		}
		//add downward moves
		cur_linear_pos = this.space.linear;
		while(1) {
			cur_linear_pos += 8;
			if(cur_linear_pos > 63) break;
			if(nonvalid_moves.includes(cur_linear_pos)) break;
			if(killable_moves.includes(cur_linear_pos)) {
				this.valid_moves.push(cur_linear_pos);
				this.kill_moves.push(cur_linear_pos);
				break;
			}
			this.valid_moves.push(cur_linear_pos);
		}
		//add left moves
		cur_linear_pos = this.space.linear;
		while(1) {
			cur_linear_pos -= 1;
			if(this.game.mod(cur_linear_pos,8) == 7) break;
			if(nonvalid_moves.includes(cur_linear_pos)) break;
			if(killable_moves.includes(cur_linear_pos)) {
				this.valid_moves.push(cur_linear_pos);
				this.kill_moves.push(cur_linear_pos);
				break;
			}
			this.valid_moves.push(cur_linear_pos);
		}
		//add right moves
		cur_linear_pos = this.space.linear;
		while(1) {
			cur_linear_pos += 1;
			if(this.game.mod(cur_linear_pos,8) == 0) break;
			if(nonvalid_moves.includes(cur_linear_pos)) break;
			if(killable_moves.includes(cur_linear_pos)) {
				this.valid_moves.push(cur_linear_pos);
				this.kill_moves.push(cur_linear_pos);
				break;
			}
			this.valid_moves.push(cur_linear_pos);
		}
	}
}