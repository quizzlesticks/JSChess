class ColorSelectScreen {
	mouseover_select = -1;
	mousedown_select = -1;
	
	white_square = {left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
	black_square = {left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
	
	unselected_color = '#ffffff66';
	selected_color = '#ffffffcc';
	mousedown_color = '#00ff00aa';
	already_selected_color = '#ff000066';
	already_selected = {black: false, white: false};
	
	cur_connection_counter = 0;
	cur_connection_counter_dots = 0;
	
	constructor(game) {
		this.game = game;
		this.preDraw();
	}
	
	preDraw() {
		const width = this.game.tile_size*8+this.game.line_size*9;
		const height = width;
		const square_width = this.game.tile_size*2;
		
		if(this.game.one_dimension) {
			this.white_square.left = this.game.line_size*2+this.game.tile_size;
			this.white_square.right = this.white_square.left+this.game.tile_size+this.game.line_size;
			this.white_square.top = 1;
			this.white_square.bottom = this.white_square.top+this.game.tile_size+this.game.line_size;
			this.white_square.width = this.game.tile_size+this.game.line_size;
			this.white_square.height = this.game.tile_size+this.game.line_size;
			this.white_square.x = this.white_square.left+2;
			this.white_square.y = this.white_square.top + 1;
			
			this.black_square.left = this.game.line_size*4+this.game.tile_size*3;
			this.black_square.right = this.black_square.left+this.game.tile_size+this.game.line_size;
			this.black_square.top = 1;
			this.black_square.bottom = this.black_square.top+this.game.tile_size+this.game.line_size;
			this.black_square.width = this.game.tile_size+this.game.line_size;;
			this.black_square.height = this.game.tile_size+this.game.line_size;;
			this.black_square.x = this.black_square.left+2;
			this.black_square.y = this.black_square.top + 1;
		} else {
			this.white_square.left = 3*width/16;
			this.white_square.right = this.white_square.left+square_width;
			this.white_square.top = 3*height/8;
			this.white_square.bottom = this.white_square.top+square_width;
			this.white_square.width = square_width;
			this.white_square.height = square_width;
			this.white_square.x = this.white_square.left+width/16-2;
			this.white_square.y = 3*height/8+height/16-2;
			
			this.black_square.left = 9*width/16;
			this.black_square.right = this.black_square.left+square_width;
			this.black_square.top = 3*height/8;
			this.black_square.bottom = this.black_square.top+square_width;
			this.black_square.width = square_width;
			this.black_square.height = square_width;
			this.black_square.x = this.black_square.left+width/16-2;
			this.black_square.y = 3*height/8+height/16-2;
		}
	}
	
	connectionDraw() {
		this.game.ctx.save();
		this.game.ctx.fillStyle = '#70706eee';
		this.game.ctx.fillRect(0,0,this.game.width, this.game.height);
		this.game.ctx.font = "64px serif";
		this.game.ctx.textBaseline = 'middle';
		this.game.ctx.textAlign = 'center';
		this.game.ctx.fillStyle = 'white';
		this.cur_connection_counter += 1;
		if(this.cur_connection_counter == 76) {
			this.cur_connection_counter = 0;
			this.cur_connection_counter_dots += 1;
			if(this.cur_connection_counter_dots == 4) {
				this.cur_connection_counter_dots = 0;
			}
		}
		const str = 'Connecting' + '.'.repeat(this.cur_connection_counter_dots) + ' '.repeat(3-this.cur_connection_counter_dots);
		this.game.ctx.fillText(str, this.game.width/2, this.game.height/2);
		this.game.ctx.restore();
	}
	
	draw(black) {
		this.game.ctx.save();
		//fuzz background
		this.game.ctx.fillStyle = '#70706eee';
		this.game.ctx.fillRect(0,0,this.game.width, this.game.height);
		//draw selection squares
		this.game.ctx.strokeStyle = 'black';
		this.game.ctx.lineWidth = 2.0;
			//white square
		if(this.mousedown_select == 0) {
			if(this.already_selected.white) {
				this.game.ctx.fillStyle = this.already_selected_color;
			} else {
				this.game.ctx.fillStyle = this.mousedown_color;
			}
		} else if (this.mouseover_select == 0) {
			if(this.already_selected.white) {
				this.game.ctx.fillStyle = this.already_selected_color;
			} else {
				this.game.ctx.fillStyle = this.selected_color;
			}
		} else {
			this.game.ctx.fillStyle = this.unselected_color;
		}
		this.game.ctx.fillRect(this.white_square.left, this.white_square.top, this.white_square.width, this.white_square.height);
		this.game.ctx.strokeRect(this.white_square.left, this.white_square.top, this.white_square.width, this.white_square.height);
			//black square
		if(this.mousedown_select == 1) {
			if(this.already_selected.black) {
				this.game.ctx.fillStyle = this.already_selected_color;
			} else {
				this.game.ctx.fillStyle = this.mousedown_color;
			}
		} else if (this.mouseover_select == 1) {
			if(this.already_selected.black) {
				this.game.ctx.fillStyle = this.already_selected_color;
			} else {
				this.game.ctx.fillStyle = this.selected_color;
			}
		} else {
			this.game.ctx.fillStyle = this.unselected_color;
		}
		this.game.ctx.fillRect(this.black_square.left, this.black_square.top, this.black_square.width, this.black_square.height);
		this.game.ctx.strokeRect(this.black_square.left, this.black_square.top, this.black_square.width, this.black_square.height);
		//draw pieces
			//white
		this.game.ctx.fillStyle = 'white';
		this.game.ctx.strokeStyle = 'black';
		this.game.ctx.lineWidth = 1.0;
		this.game.ctx.translate(this.white_square.x, this.white_square.y);
		this.game.ctx.fill(this.game.pieces[this.game.piece_indices.black.pawn[0]].path);
		this.game.ctx.stroke(this.game.pieces[this.game.piece_indices.black.pawn[0]].stroke_path);
		this.game.ctx.translate(-this.white_square.x, -this.white_square.y);
			//black
		this.game.ctx.fillStyle = 'black';
		this.game.ctx.translate(this.black_square.x, this.black_square.y);
		this.game.ctx.fill(this.game.pieces[this.game.piece_indices.black.pawn[0]].path);
		this.game.ctx.translate(-this.black_square.x, -this.black_square.y);
		//already select x's
		if(this.already_selected.white) {
			this.game.ctx.lineWidth = 3.0;
			this.game.ctx.strokeStyle = 'red';
			this.game.ctx.beginPath()
			this.game.ctx.moveTo(this.white_square.left+2, this.white_square.top+2);
			this.game.ctx.lineTo(this.white_square.right-2, this.white_square.bottom-2);
			this.game.ctx.moveTo(this.white_square.right-2, this.white_square.top+2);
			this.game.ctx.lineTo(this.white_square.left+2, this.white_square.bottom-2);
			this.game.ctx.stroke();
		}
		if(this.already_selected.black) {
			this.game.ctx.strokeStyle = 'red';
			this.game.ctx.lineWidth = 3.0;
			this.game.ctx.beginPath();
			this.game.ctx.moveTo(this.black_square.left+2, this.black_square.top+2);
			this.game.ctx.lineTo(this.black_square.right-2, this.black_square.bottom-2);
			this.game.ctx.moveTo(this.black_square.right-2, this.black_square.top+2);
			this.game.ctx.lineTo(this.black_square.left+2, this.black_square.bottom-2);
			this.game.ctx.stroke();
		}
		this.game.ctx.restore();
	}
	
	collide(pos, mouse_type) {
		if(pos.x >= this.white_square.left && pos.x <= this.white_square.right && pos.y >= this.white_square.top && pos.y <= this.white_square.bottom) {
			if(mouse_type == 'mouseover' && this.mousedown_select == -1) {
				this.mouseover_select = 0;
			} else if(mouse_type == 'mousedown') {
				this.mouseover_select = -1;
				this.mousedown_select = 0;
			} else if(mouse_type == 'mouseup' && this.mousedown_select==0 && !this.already_selected.white) {
				this.mouseover_select = -1;
				this.mousedown_select = -1;
				return 'white';
			} else if(mouse_type == 'mouseup') {
				this.mouseover_select = 0;
				this.mousedown_select = -1;
				return 'none';
			}
		} else if(pos.x >= this.black_square.left && pos.x <= this.black_square.right && pos.y >= this.black_square.top && pos.y <= this.black_square.bottom) {
			if(mouse_type == 'mouseover' && this.mousedown_select == -1) {
				this.mouseover_select = 1;
			} else if(mouse_type == 'mousedown') {
				this.mouseover_select = -1;
				this.mousedown_select = 1;
			} else if(mouse_type == 'mouseup' && this.mousedown_select==1 && !this.already_selected.black) {
				this.mouseover_select = -1;
				this.mousedown_select = -1;
				return 'black';
			} else if(mouse_type == 'mouseup') {
				this.mouseover_select = 1;
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