class Piece {
	game = undefined;
	path = new Path2D();
	stroke_path = new Path2D();
	space = {grid: {x: 0, y: 0}, linear: 0};
	x = 0;
	y = 0;
	black = false;
	type = "N/A";
	valid_moves = [];
	kill_moves = [];
	illegal_moves = [];
	castle_moves = [];
	enpassantable = false;
	piece_color = "red";
	first_move_made = false;
	
	constructor(game, black, x, y) {
		this.game = game;
		this.black = black;
		if(this.black ^ this.game.player_black) {
			this.piece_color = "black";
		} else {
			this.piece_color = "white";
		}
		this.setSpace(this.game.gridToLinear(x,y), true);
	}
	
	pruneIllegalMoves() {
		for (const illegal_move of this.illegal_moves) {
			this.valid_moves.splice(this.valid_moves.indexOf(illegal_move), 1);
			if(this.kill_moves.includes(illegal_move)) {
				this.kill_moves.splice(this.kill_moves.indexOf(illegal_move), 1);
			}
		}
	}
	
	draw() {
		if(this.pepsi) return;
		this.game.ctx.save();
		if(this.black ^ this.game.player_black) {
			this.game.ctx.fillStyle = this.piece_color;
		} else {
			this.game.ctx.fillStyle = this.piece_color;
			this.game.ctx.strokeStyle = 'black';
		}
		this.game.ctx.translate(this.x,this.y);
		if(this.black ^ this.game.player_black) {
			this.game.ctx.fill(this.path);
		} else {
			this.game.ctx.fill(this.path);
			this.game.ctx.stroke(this.stroke_path);
		}
		this.game.ctx.restore();
	}
	
	resetSpace() {
		this.setSpace(this.space.linear, true);
	}
	
	validateMove(grid_pos) {
		return this.valid_moves.includes(grid_pos.linear);
	}
	
	setSpace(L, fake=false) {
		if(!fake && !this.first_move_made) {
			this.first_move_made = true;
		}
		this.space.grid.x = this.game.mod(L,8);
		this.space.grid.y = Math.floor(L/8);
		this.space.linear = L;
		if(this.game.one_dimension) {
			this.x = this.game.tile_size*(this.space.linear) + this.game.line_size*(this.space.linear+1);
			this.y = this.game.line_size;
		} else {
			this.x = this.game.tile_size*this.space.grid.x + this.game.line_size*(this.space.grid.x+1);
			this.y = this.game.tile_size*this.space.grid.y + this.game.line_size*(this.space.grid.y+1);
		}
	}
	
	move(delta) {
		this.x += delta.x;
		this.y += delta.y;
	}
	
	collide(x, y) {
		if(this.pepsi) return false;
		var right = this.x + this.game.tile_size;
		var bottom = this.y + this.game.tile_size;
		if(x >= this.x && x <= right && y >= this.y && y <= bottom) {
			return true;
		} else {
			return false;
		}
	}
	
	drawMoves() {
		this.game.ctx.save();
		this.game.ctx.fillStyle = "#00FF0066";
		var grid_move;
		for (const move of this.valid_moves) {
			if(this.kill_moves.includes(move)) continue;
			if(this.castle_moves.includes(move)) continue;
			grid_move = this.game.linearToGrid(move);
			if(!this.game.one_dimension) {
				grid_move.x = grid_move.x*this.game.line_size + grid_move.x*this.game.tile_size + this.game.line_size;
				grid_move.y = grid_move.y*this.game.line_size + grid_move.y*this.game.tile_size + this.game.line_size;
			} else {
				grid_move.x = (grid_move.x+grid_move.y*8)*this.game.line_size + (grid_move.x+grid_move.y*8)*this.game.tile_size + this.game.line_size;
				grid_move.y = this.game.line_size;
			}
			this.game.ctx.fillRect(grid_move.x, grid_move.y, this.game.tile_size, this.game.tile_size);
		}
		this.game.ctx.fillStyle = "#FF000066";
		for (const move of this.kill_moves) {
			grid_move = this.game.linearToGrid(move);
			if(!this.game.one_dimension) {
				grid_move.x = grid_move.x*this.game.line_size + grid_move.x*this.game.tile_size + this.game.line_size;
				grid_move.y = grid_move.y*this.game.line_size + grid_move.y*this.game.tile_size + this.game.line_size;
			} else {
				grid_move.x = (grid_move.x+grid_move.y*8)*this.game.line_size + (grid_move.x+grid_move.y*8)*this.game.tile_size + this.game.line_size;
				grid_move.y = this.game.line_size;
			}
			this.game.ctx.fillRect(grid_move.x, grid_move.y, this.game.tile_size, this.game.tile_size);
		}
		this.game.ctx.fillStyle = "#fc03ec66";
		for (const move of this.illegal_moves) {
			grid_move = this.game.linearToGrid(move);
			if(!this.game.one_dimension) {
				grid_move.x = grid_move.x*this.game.line_size + grid_move.x*this.game.tile_size + this.game.line_size;
				grid_move.y = grid_move.y*this.game.line_size + grid_move.y*this.game.tile_size + this.game.line_size;
			} else {
				grid_move.x = (grid_move.x+grid_move.y*8)*this.game.line_size + (grid_move.x+grid_move.y*8)*this.game.tile_size + this.game.line_size;
				grid_move.y = this.game.line_size;
			}
			this.game.ctx.fillRect(grid_move.x, grid_move.y, this.game.tile_size, this.game.tile_size);
		}
		this.game.ctx.fillStyle = "#1724e366";
		for (const move of this.castle_moves) {
			grid_move = this.game.linearToGrid(move);
			if(!this.game.one_dimension) {
				grid_move.x = grid_move.x*this.game.line_size + grid_move.x*this.game.tile_size + this.game.line_size;
				grid_move.y = grid_move.y*this.game.line_size + grid_move.y*this.game.tile_size + this.game.line_size;
			} else {
				grid_move.x = (grid_move.x+grid_move.y*8)*this.game.line_size + (grid_move.x+grid_move.y*8)*this.game.tile_size + this.game.line_size;
				grid_move.y = this.game.line_size;
			}
			this.game.ctx.fillRect(grid_move.x, grid_move.y, this.game.tile_size, this.game.tile_size);
		}
		this.game.ctx.restore();
	}
}