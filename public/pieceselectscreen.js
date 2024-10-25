class PieceSelectScreen {
	mouseover_select = -1;
	mousedown_select = -1;
	
	rook_square = {left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
	knight_square = {left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
	bishop_square = {left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
	queen_square = {left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
	
	unselected_color = '#ffffff66';
	selected_color = '#ffffffcc';
	mousedown_color = '#00ff00aa';
	
	constructor(game) {
		this.game = game;
		this.preDraw();
	}
	
	preDraw() {
		const width = this.game.tile_size*8+this.game.line_size*9;
		const height = width;
		const margin = 20;
		const square_width = width/4-margin*2;
		
		this.rook_square.left = margin;
		this.rook_square.right = this.rook_square.left+square_width;
		this.rook_square.top = 3*height/8+margin;
		this.rook_square.bottom = this.rook_square.top+square_width;
		this.rook_square.width = square_width;
		this.rook_square.height = square_width;
		this.rook_square.x = margin+this.game.tile_size/4-2;
		this.rook_square.y = 3*height/8+margin+this.game.tile_size/4-5;
		
		this.knight_square.left = margin+width/4;
		this.knight_square.right = this.knight_square.left+square_width;
		this.knight_square.top = 3*height/8+margin;
		this.knight_square.bottom = this.knight_square.top+square_width;
		this.knight_square.width = square_width;
		this.knight_square.height = square_width;
		this.knight_square.x = margin+this.game.tile_size/4-2+width/4;
		this.knight_square.y = 3*height/8+margin+this.game.tile_size/4-5;
		
		this.bishop_square.left = margin+width/2;
		this.bishop_square.right = this.bishop_square.left+square_width;
		this.bishop_square.top = 3*height/8+margin;
		this.bishop_square.bottom = this.bishop_square.top+square_width;
		this.bishop_square.width = square_width;
		this.bishop_square.height = square_width;
		this.bishop_square.x = margin+this.game.tile_size/4-2+width/2;
		this.bishop_square.y = 3*height/8+margin+this.game.tile_size/4-5;
		
		this.queen_square.left = margin+3*width/4;
		this.queen_square.right = this.queen_square.left+square_width;
		this.queen_square.top = 3*height/8+margin;
		this.queen_square.bottom = this.queen_square.top+square_width;
		this.queen_square.width = square_width;
		this.queen_square.height = square_width;
		this.queen_square.x = margin+this.game.tile_size/4-2+3*width/4;
		this.queen_square.y = 3*height/8+margin+this.game.tile_size/4-5;
	}
	
	draw(black) {
		black = black^this.game.player_black;
		this.game.ctx.save();
		//fuzz background
		this.game.ctx.fillStyle = '#70706ebb';
		this.game.ctx.fillRect(0,0,this.game.width, this.game.height);
		//draw selection squares
		this.game.ctx.strokeStyle = 'black';
		this.game.ctx.lineWidth = 2.0;
			//rook square
		if(this.mousedown_select == 0) {
			this.game.ctx.fillStyle = this.mousedown_color;
		} else if (this.mouseover_select == 0) {
			this.game.ctx.fillStyle = this.selected_color;
		} else {
			this.game.ctx.fillStyle = this.unselected_color;
		}
		this.game.ctx.fillRect(this.rook_square.left, this.rook_square.top, this.rook_square.width, this.rook_square.height);
		this.game.ctx.strokeRect(this.rook_square.left, this.rook_square.top, this.rook_square.width, this.rook_square.height);
			//knight square
		if(this.mousedown_select == 1) {
			this.game.ctx.fillStyle = this.mousedown_color;
		} else if (this.mouseover_select == 1) {
			this.game.ctx.fillStyle = this.selected_color;
		} else {
			this.game.ctx.fillStyle = this.unselected_color;
		}
		this.game.ctx.fillRect(this.knight_square.left, this.knight_square.top, this.knight_square.width, this.knight_square.height);
		this.game.ctx.strokeRect(this.knight_square.left, this.knight_square.top, this.knight_square.width, this.knight_square.height);
			//bishop square
		if(this.mousedown_select == 2) {
			this.game.ctx.fillStyle = this.mousedown_color;
		} else if (this.mouseover_select == 2) {
			this.game.ctx.fillStyle = this.selected_color;
		} else {
			this.game.ctx.fillStyle = this.unselected_color;
		}
		this.game.ctx.fillRect(this.bishop_square.left, this.bishop_square.top, this.bishop_square.width, this.bishop_square.height);
		this.game.ctx.strokeRect(this.bishop_square.left, this.bishop_square.top, this.bishop_square.width, this.bishop_square.height);
			//queen square
		if(this.mousedown_select == 3) {
			this.game.ctx.fillStyle = this.mousedown_color;
		} else if (this.mouseover_select == 3) {
			this.game.ctx.fillStyle = this.selected_color;
		} else {
			this.game.ctx.fillStyle = this.unselected_color;
		}
		this.game.ctx.fillRect(this.queen_square.left, this.queen_square.top, this.queen_square.width, this.queen_square.height);
		this.game.ctx.strokeRect(this.queen_square.left, this.queen_square.top, this.queen_square.width, this.queen_square.height);
		//draw pieces
		if(black) {
			this.game.ctx.fillStyle = 'black';
		} else {
			this.game.ctx.fillStyle = 'white';
			this.game.ctx.strokeStyle = 'black';
			this.game.ctx.lineWidth = 1.0;
		}
			//rook
		this.game.ctx.translate(this.rook_square.x, this.rook_square.y);
		this.game.ctx.fill(this.game.pieces[this.game.piece_indices.black.rook[0]].path);
		if(!black) {
			this.game.ctx.stroke(this.game.pieces[this.game.piece_indices.black.rook[0]].stroke_path);
		}
		this.game.ctx.translate(-this.rook_square.x, -this.rook_square.y);
			//knight
		this.game.ctx.translate(this.knight_square.x, this.knight_square.y);
		this.game.ctx.fill(this.game.pieces[this.game.piece_indices.black.knight[0]].path);
		if(!black) {
			this.game.ctx.stroke(this.game.pieces[this.game.piece_indices.black.knight[0]].stroke_path);
		}
		this.game.ctx.translate(-this.knight_square.x, -this.knight_square.y);
			//bishop
		this.game.ctx.translate(this.bishop_square.x, this.bishop_square.y);
		this.game.ctx.fill(this.game.pieces[this.game.piece_indices.black.bishop[0]].path);
		if(!black) {
			this.game.ctx.stroke(this.game.pieces[this.game.piece_indices.black.bishop[0]].stroke_path);
		}
		this.game.ctx.translate(-this.bishop_square.x, -this.bishop_square.y);
			//queen
		this.game.ctx.translate(this.queen_square.x, this.queen_square.y);
		this.game.ctx.fill(this.game.pieces[this.game.piece_indices.black.queen[0]].path);
		if(!black) {
			this.game.ctx.stroke(this.game.pieces[this.game.piece_indices.black.queen[0]].stroke_path);
		}
		this.game.ctx.translate(-this.queen_square.x, -this.queen_square.y);
		this.game.ctx.restore();
	}
	
	collide(pos, mouse_type) {
		if(pos.x >= this.rook_square.left && pos.x <= this.rook_square.right && pos.y >= this.rook_square.top && pos.y <= this.rook_square.bottom) {
			if(mouse_type == 'mouseover' && this.mousedown_select == -1) {
				this.mouseover_select = 0;
			} else if(mouse_type == 'mousedown') {
				this.mouseover_select = -1;
				this.mousedown_select = 0;
			} else if(mouse_type == 'mouseup' && this.mousedown_select==0) {
				this.mouseover_select = -1;
				this.mousedown_select = -1;
				return 'rook';
			} else if(mouse_type == 'mouseup') {
				this.mouseover_select = 0;
				this.mousedown_select = -1;
				return 'none';
			}
		} else if(pos.x >= this.knight_square.left && pos.x <= this.knight_square.right && pos.y >= this.knight_square.top && pos.y <= this.knight_square.bottom) {
			if(mouse_type == 'mouseover' && this.mousedown_select == -1) {
				this.mouseover_select = 1;
			} else if(mouse_type == 'mousedown') {
				this.mouseover_select = -1;
				this.mousedown_select = 1;
			} else if(mouse_type == 'mouseup' && this.mousedown_select==1) {
				this.mouseover_select = -1;
				this.mousedown_select = -1;
				return 'knight';
			} else if(mouse_type == 'mouseup') {
				this.mouseover_select = 1;
				this.mousedown_select = -1;
				return 'none';
			}
		} else if(pos.x >= this.bishop_square.left && pos.x <= this.bishop_square.right && pos.y >= this.bishop_square.top && pos.y <= this.bishop_square.bottom) {
			if(mouse_type == 'mouseover' && this.mousedown_select == -1) {
				this.mouseover_select = 2;
			} else if(mouse_type == 'mousedown') {
				this.mouseover_select = -1;
				this.mousedown_select = 2;
			} else if(mouse_type == 'mouseup' && this.mousedown_select==2) {
				this.mouseover_select = -1;
				this.mousedown_select = -1;
				return 'bishop';
			} else if(mouse_type == 'mouseup') {
				this.mouseover_select = 2;
				this.mousedown_select = -1;
				return 'none';
			}
		} else if(pos.x >= this.queen_square.left && pos.x <= this.queen_square.right && pos.y >= this.queen_square.top && pos.y <= this.queen_square.bottom) {
			if(mouse_type == 'mouseover' && this.mousedown_select == -1) {
				this.mouseover_select = 3;
			} else if(mouse_type == 'mousedown') {
				this.mouseover_select = -1;
				this.mousedown_select = 3;
			} else if(mouse_type == 'mouseup' && this.mousedown_select==3) {
				this.mouseover_select = -1;
				this.mousedown_select = -1;
				return 'queen';
			} else if(mouse_type == 'mouseup') {
				this.mouseover_select = 3;
				this.mousedown_select = -1;
				return 'none';
			}
		} else {
			this.mouseover_select = -1;
			this.mousedown_select = -1;
			if(mouse_type == 'mouseup') {
				return 'none';
			}
		}
	}
}