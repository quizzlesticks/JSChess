class Queen extends Piece {
	
	constructor(game, black, x, y) {
		super(game, black, x, y);
		this.preDrawFill();
		this.preDrawStroke();
		this.type = "queen";
	}
	
	preDrawFill() {
		//head
			//middle pointy bit
		this.path.moveTo(33,12);
		this.path.lineTo(24,33);
		this.path.lineTo(33,46);
		this.path.lineTo(42,33);
			//left pointy bit
		this.path.moveTo(32,46);
		this.path.lineTo(8,12);
		this.path.lineTo(22,46);
		this.path.lineTo(32,46);
			//right pointy bit
		this.path.moveTo(34,46);
		this.path.lineTo(58,12);
		this.path.lineTo(44,46);
		this.path.lineTo(34,46);
		
		//base
		this.path.roundRect(17, 47, 32, 10, [3, 3, 0, 0]);
		//bottom rect
		this.path.rect(14, 58, 38, 4);
	}
	
	preDrawStroke() {
		//head
			//middle pointy bit
		this.stroke_path.moveTo(33,12);
		this.stroke_path.lineTo(24,33);
		this.stroke_path.moveTo(33,12);
		this.stroke_path.lineTo(42,33);
			//left pointy bit
		this.stroke_path.moveTo(32,46);
		this.stroke_path.lineTo(8,12);
		this.stroke_path.lineTo(22,46);
		this.stroke_path.lineTo(32,46);
			//right pointy bit
		this.stroke_path.moveTo(34,46);
		this.stroke_path.lineTo(58,12);
		this.stroke_path.lineTo(44,46);
		this.stroke_path.lineTo(34,46);
		
		//base
		this.stroke_path.roundRect(17, 47, 32, 10, [3, 3, 0, 0]);
		//bottom rect
		this.stroke_path.rect(14, 58, 38, 4);
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
		//add upward moves
		cur_linear_pos = this.space.linear;
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