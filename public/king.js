class King extends Piece {
	
	checked = false;
	
	constructor(game, black, x, y) {
		super(game, black, x, y);
		this.preDrawFill();
		this.preDrawStroke();
		this.type = "king";
	}
	
	preDrawFill() {
		//head
			//middle pointy bit
		this.path.moveTo(33,6);
		this.path.lineTo(24,33);
		this.path.lineTo(33,46);
		this.path.lineTo(42,33);
		this.path.lineTo(33,6);
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
			//back left pointy bit
		this.path.moveTo(23,32);
		this.path.lineTo(19,26);
		this.path.lineTo(21,15);
		this.path.lineTo(26,22);
			//back right pointy bit
		this.path.moveTo(43,32);
		this.path.lineTo(47,26);
		this.path.lineTo(45,15);
		this.path.lineTo(40,22);
		//base
		this.path.roundRect(17, 47, 32, 10, [3, 3, 0, 0]);
		//bottom rect
		this.path.rect(14, 58, 38, 4);
	}
	
	draw() {
		if (this.checked) {
			this.piece_color = "#ed2626";
		} else {
			if(this.black ^ this.game.player_black) {
				this.piece_color = "black";
			} else {
				this.piece_color = "white";
			}
		}
		super.draw();
	}
	
	preDrawStroke() {
		//head
			//middle pointy bit
		this.stroke_path.moveTo(33,6);
		this.stroke_path.lineTo(24,33);
		this.stroke_path.moveTo(33,6);
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
			//back left pointy bit
		this.stroke_path.moveTo(19,26);
		this.stroke_path.lineTo(21,15);
		this.stroke_path.lineTo(26,22);
			//back right pointy bit
		this.stroke_path.moveTo(47,26);
		this.stroke_path.lineTo(45,15);
		this.stroke_path.lineTo(40,22);
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
		//up and left
		if(this.game.mod(this.space.linear,8) != 0 && this.space.linear-9 >= 0 && !nonvalid_moves.includes(this.space.linear-9)) {
			this.valid_moves.push(this.space.linear-9);
			if(killable_moves.includes(this.space.linear-9)) this.kill_moves.push(this.space.linear-9);
		}
		//up
		if(this.space.linear-8 >= 0  && !nonvalid_moves.includes(this.space.linear-8)) {
			this.valid_moves.push(this.space.linear-8);
			if(killable_moves.includes(this.space.linear-8)) this.kill_moves.push(this.space.linear-8);
		}
		//up and right
		if(this.game.mod(this.space.linear,8) != 7 && this.space.linear-7 >= 0 && !nonvalid_moves.includes(this.space.linear-7)) {
			this.valid_moves.push(this.space.linear-7);
			if(killable_moves.includes(this.space.linear-7)) this.kill_moves.push(this.space.linear-7);
		}
		//right
		if(this.game.mod(this.space.linear,8) != 7 && !nonvalid_moves.includes(this.space.linear+1)) {
			this.valid_moves.push(this.space.linear+1);
			if(killable_moves.includes(this.space.linear+1)) this.kill_moves.push(this.space.linear+1);
		}
		//down and right
		if(this.game.mod(this.space.linear,8) != 7 && this.space.linear+9 <= 63 && !nonvalid_moves.includes(this.space.linear+9)) {
			this.valid_moves.push(this.space.linear+9);
			if(killable_moves.includes(this.space.linear+9)) this.kill_moves.push(this.space.linear+9);
		}
		//down
		if(this.space.linear+8 <= 63 && !nonvalid_moves.includes(this.space.linear+8)) {
			this.valid_moves.push(this.space.linear+8);
			if(killable_moves.includes(this.space.linear+8)) this.kill_moves.push(this.space.linear+8);
		}
		//down and left
		if(this.game.mod(this.space.linear,8) != 0 && this.space.linear+7 <= 63 && !nonvalid_moves.includes(this.space.linear+7)) {
			this.valid_moves.push(this.space.linear+7);
			if(killable_moves.includes(this.space.linear+7)) this.kill_moves.push(this.space.linear+7);
		}
		//left
		if(this.game.mod(this.space.linear,8) != 0 && !nonvalid_moves.includes(this.space.linear-1)) {
			this.valid_moves.push(this.space.linear-1);
			if(killable_moves.includes(this.space.linear-1)) this.kill_moves.push(this.space.linear-1);
		}
	}
}