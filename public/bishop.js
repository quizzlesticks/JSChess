class Bishop extends Piece {
	
	constructor(game, black, x, y) {
		super(game, black, x, y);
		this.preDraw();
		this.type = "bishop";
	}
	
	preDraw() {
		//top dot
		this.path.moveTo(29, 9);
		this.path.bezierCurveTo(32, 12, 34, 12, 37, 9);
		this.path.bezierCurveTo(39, 5, 36, 5, 33, 2);
		this.path.bezierCurveTo(30, 5, 27, 5, 29, 9);
		//big thing
		this.path.moveTo(22, 42);
		this.path.lineTo(44, 42);
		this.path.bezierCurveTo(51, 30, 44, 15, 38, 9);
		this.path.bezierCurveTo(34, 13, 32, 13, 28, 9);
		this.path.bezierCurveTo(22, 15, 15, 30, 22, 42);
		//rect above base
		this.path.rect(24, 43, 18, 3);
		//base
		this.path.roundRect(17, 47, 32, 10, [3, 3, 0, 0]);
		//bottom rect
		this.path.rect(14, 58, 38, 4);
		
		this.stroke_path = this.path;
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
		//up and right
		var cur_linear_pos = this.space.linear;
		while(1) {
			if(this.game.mod(cur_linear_pos,8) == 7 || cur_linear_pos-7 < 0) break;
			cur_linear_pos -= 7;
			if(nonvalid_moves.includes(cur_linear_pos)) break;
			if(killable_moves.includes(cur_linear_pos)) {
				this.valid_moves.push(cur_linear_pos);
				this.kill_moves.push(cur_linear_pos);
				break;
			}
			this.valid_moves.push(cur_linear_pos);
		}
		//up and left
		cur_linear_pos = this.space.linear;
		while(1) {
			if(this.game.mod(cur_linear_pos,8) == 0 || cur_linear_pos-9 < 0) break;
			cur_linear_pos -= 9;
			if(nonvalid_moves.includes(cur_linear_pos)) break;
			if(killable_moves.includes(cur_linear_pos)) {
				this.valid_moves.push(cur_linear_pos);
				this.kill_moves.push(cur_linear_pos);
				break;
			}
			this.valid_moves.push(cur_linear_pos);
		}
		//down and right
		cur_linear_pos = this.space.linear;
		while(1) {
			if(this.game.mod(cur_linear_pos,8) == 7 || cur_linear_pos+9 > 63) break;
			cur_linear_pos += 9;
			if(nonvalid_moves.includes(cur_linear_pos)) break;
			if(killable_moves.includes(cur_linear_pos)) {
				this.valid_moves.push(cur_linear_pos);
				this.kill_moves.push(cur_linear_pos);
				break;
			}
			this.valid_moves.push(cur_linear_pos);
		}
		//down and left
		cur_linear_pos = this.space.linear;
		while(1) {
			if(this.game.mod(cur_linear_pos,8) == 0 || cur_linear_pos+7 > 63) break;
			cur_linear_pos += 7;
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