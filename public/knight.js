class Knight extends Piece {
	
	constructor(game, black, x, y) {
		super(game, black, x, y);
		this.preDraw();
		this.type = "knight";
	}
	
	preDraw() {
		//head
		this.path.moveTo(33,2);
		this.path.bezierCurveTo(34, 3, 36, 3, 37, 6);
		this.path.bezierCurveTo(45, 6, 50, 30, 44, 42);
		this.path.lineTo(22, 42);
			//chest
		this.path.bezierCurveTo(23, 40, 22, 37, 28, 34);
		this.path.bezierCurveTo(31, 31, 31, 22, 32, 18);
			//chin
		this.path.bezierCurveTo(30, 20, 30, 20, 26, 18);
		this.path.bezierCurveTo(24, 17, 24, 18, 20, 20);
		//snout
		this.path.bezierCurveTo(24, 17, 24, 18, 16, 23);
		this.path.bezierCurveTo(14, 21, 16, 19, 14, 18);
		this.path.bezierCurveTo(22, 14, 22, 7, 32, 5);
		//small rect above base
		this.path.rect(24, 43, 18, 3);
		//base
		//rounded section
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
		//up 2 and left
		if(this.game.mod(this.space.linear,8) != 0 && this.space.linear-17 >= 0 && !nonvalid_moves.includes(this.space.linear-17)) {
			this.valid_moves.push(this.space.linear-17);
			if(killable_moves.includes(this.space.linear-17)) this.kill_moves.push(this.space.linear-17);
		}
		//up 2 and right
		if(this.game.mod(this.space.linear,8) != 7 && this.space.linear-15 >= 0 && !nonvalid_moves.includes(this.space.linear-15)) {
			this.valid_moves.push(this.space.linear-15);
			if(killable_moves.includes(this.space.linear-15)) this.kill_moves.push(this.space.linear-15);
		}
		//right 2 and up
		if(this.game.mod(this.space.linear,8) <= 5 && this.space.linear-6 >= 0 && !nonvalid_moves.includes(this.space.linear-6)) {
			this.valid_moves.push(this.space.linear-6);
			if(killable_moves.includes(this.space.linear-6)) this.kill_moves.push(this.space.linear-6);
		}
		//right 2 and down
		if(this.game.mod(this.space.linear,8) <= 5 && this.space.linear+10 <= 63 && !nonvalid_moves.includes(this.space.linear+10)) {
			this.valid_moves.push(this.space.linear+10);
			if(killable_moves.includes(this.space.linear+10)) this.kill_moves.push(this.space.linear+10);
		}
		//down 2 and right
		if(this.game.mod(this.space.linear,8) != 7 && this.space.linear+17 <= 63 && !nonvalid_moves.includes(this.space.linear+17)) {
			this.valid_moves.push(this.space.linear+17);
			if(killable_moves.includes(this.space.linear+17)) this.kill_moves.push(this.space.linear+17);
		}
		//down 2 and left
		if(this.game.mod(this.space.linear,8) != 0 && this.space.linear+15 <= 63 && !nonvalid_moves.includes(this.space.linear+15)) {
			this.valid_moves.push(this.space.linear+15);
			if(killable_moves.includes(this.space.linear+15)) this.kill_moves.push(this.space.linear+15);
		}
		//left 2 and down
		if(this.game.mod(this.space.linear,8) >= 2 && this.space.linear+6 <= 63 && !nonvalid_moves.includes(this.space.linear+6)) {
			this.valid_moves.push(this.space.linear+6);
			if(killable_moves.includes(this.space.linear+6)) this.kill_moves.push(this.space.linear+6);
		}
		//left 2 and up
		if(this.game.mod(this.space.linear,8) >= 2 && this.space.linear-10 >= 0 && !nonvalid_moves.includes(this.space.linear-10)) {
			this.valid_moves.push(this.space.linear-10);
			if(killable_moves.includes(this.space.linear-10)) this.kill_moves.push(this.space.linear-10);
		}
	}
}