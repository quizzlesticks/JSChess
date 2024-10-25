class Pawn extends Piece {
	
	first_move_made = false;
	
	constructor(game, black, x, y) {
		super(game, black, x, y);
		this.preDraw();
		this.type = "pawn";
	}
	
	preDraw() {
		//head
		this.path.arc(33, 12, 10, Math.PI/4, Math.PI - Math.PI/4, true);
		this.path.moveTo(33-8, 19);
		this.path.lineTo(41, 19);
		//first section
		this.path.moveTo(26, 20);
		this.path.lineTo(23, 29);
		this.path.lineTo(43, 29);
		this.path.lineTo(40, 20);
		this.path.lineTo(26, 20);
		//second section
		this.path.moveTo(26, 30);
		this.path.lineTo(23, 46);
		this.path.lineTo(43, 46);
		this.path.lineTo(40, 30);
		this.path.lineTo(26, 30);
		//rounded section
		this.path.roundRect(17, 47, 32, 10, [3, 3, 0, 0]);
		//bottom rect
		this.path.rect(14, 58, 38, 4);
		
		this.stroke_path = this.path;
	}
	
	setSpace(L, fake=false) {
		if(!fake && !this.first_move_made && (L+16 == this.space.linear || L-16 == this.space.linear)) {
			this.enpassantable = true;
		}
		super.setSpace(L, fake);
	}
	
	generateValidMoves() {
		if(this.black) {
			var nonvalid_moves = this.game.currently_occupied_spaces.black;
			var killable_moves = this.game.currently_occupied_spaces.white;
			if(this.game.enpassantable_piece.white != -1) {
				killable_moves = killable_moves.concat(this.game.enpassantable_piece.black + 8);
			}
		} else {
			var nonvalid_moves = this.game.currently_occupied_spaces.white;
			var killable_moves = this.game.currently_occupied_spaces.black;
			if(this.game.enpassantable_piece.black != -1) {
				killable_moves = killable_moves.concat(this.game.enpassantable_piece.black - 8);
			}
		}
		this.valid_moves = [];
		this.kill_moves = [];
		if(this.pepsi) return;
		if(this.black) {
			if(this.game.mod(this.space.linear,8)!=0 && killable_moves.includes(this.space.linear+7)) {
				this.kill_moves.push(this.space.linear+7);
				this.valid_moves.push(this.space.linear+7);
			}
			if(this.game.mod(this.space.linear,8)!=7 && killable_moves.includes(this.space.linear+9)) {
				this.kill_moves.push(this.space.linear+9);
				this.valid_moves.push(this.space.linear+9);
			}
			if(this.space.linear+8 > 63 || nonvalid_moves.includes(this.space.linear+8)) return;
			if(killable_moves.includes(this.space.linear+8)) return;
			this.valid_moves.push(this.space.linear+8);
			if(this.first_move_made || this.space.linear+16 > 63 || nonvalid_moves.includes(this.space.linear+16) || killable_moves.includes(this.space.linear+16)) return;
			this.valid_moves.push(this.space.linear+16);
		} else {
			if(this.game.mod(this.space.linear,8)!=7 && killable_moves.includes(this.space.linear-7)) {
				this.valid_moves.push(this.space.linear-7);
				this.kill_moves.push(this.space.linear-7);
			}
			if(this.game.mod(this.space.linear,8)!=0 && killable_moves.includes(this.space.linear-9)) {
				this.kill_moves.push(this.space.linear-9);
				this.valid_moves.push(this.space.linear-9);
			}
			if(this.space.linear-8 < 0 || nonvalid_moves.includes(this.space.linear-8)) return;
			if(killable_moves.includes(this.space.linear-8)) return;
			this.valid_moves.push(this.space.linear-8);
			if(this.first_move_made || this.space.linear-16 < 0 || nonvalid_moves.includes(this.space.linear-16) || killable_moves.includes(this.space.linear-16)) return;
			this.valid_moves.push(this.space.linear-16);
		}
	}
}