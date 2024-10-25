class Board {
	game = undefined;
	light_tile_color = "#FFFDD0";
	dark_tile_color = "#c2c06e";
	
	constructor(game) {
		this.game = game;
	}
	
	draw() {
		if(this.game.one_dimension) {
			this.drawLinear();
		} else {
			this.drawTwoD();
		}
	}
	
	drawTwoD() {
		this.game.ctx.save();
		this.game.ctx.fillStyle = "red";
		this.game.ctx.fillRect(0,0, this.game.width, this.game.ctx.height);
		this.game.ctx.fillStyle = "black";
		for (let i = 0; i < 9; i++) {
			this.game.ctx.fillRect(0, this.game.line_size*i+this.game.tile_size*i, this.game.width, this.game.line_size);
			this.game.ctx.fillRect(this.game.line_size*i+this.game.tile_size*i, 0, this.game.line_size, this.game.height);
		}
		let first_color = this.light_tile_color;
		let second_color = this.dark_tile_color;
		for (let y = 0; y < 8; y++) {
			if(this.game.mod(y,2) == 0) {				
				first_color = this.light_tile_color;
				second_color = this.dark_tile_color;
			} else {
				first_color = this.dark_tile_color;
				second_color = this.light_tile_color;
			}
			for (let x = 0; x < 8; x++) {
				if(this.game.mod(x,2) == 0) {
					this.game.ctx.fillStyle = first_color;
				} else {
					this.game.ctx.fillStyle = second_color;
				}
				this.game.ctx.fillRect(x*this.game.tile_size + (x+1)*(this.game.line_size), y*this.game.tile_size + (y+1)*(this.game.line_size) , this.game.tile_size, this.game.tile_size);
			}
		}
		this.game.ctx.restore();
	}
	
	drawLinear() {
		this.game.ctx.save();
		this.game.ctx.fillStyle = "red";
		this.game.ctx.fillRect(0,0, this.game.width, this.game.ctx.height);
		this.game.ctx.fillStyle = "black";
		this.game.ctx.fillRect(0,0,this.game.width, this.game.line_size);
		this.game.ctx.fillRect(0,this.game.line_size+this.game.tile_size,this.game.width, this.game.line_size);
		for (let i = 0; i < 65; i++) {
			this.game.ctx.fillRect(this.game.line_size*i+this.game.tile_size*i, 0, this.game.line_size, this.game.height);
		}
		let first_color = this.light_tile_color;
		let second_color = this.dark_tile_color;
		for (let y = 0; y < 8; y++) {
			if(this.game.mod(y,2) == 0) {				
				first_color = this.light_tile_color;
				second_color = this.dark_tile_color;
			} else {
				first_color = this.dark_tile_color;
				second_color = this.light_tile_color;
			}
			for (let x = 0; x < 8; x++) {
				if(this.game.mod(x,2) == 0) {
					this.game.ctx.fillStyle = first_color;
				} else {
					this.game.ctx.fillStyle = second_color;
				}
				this.game.ctx.fillRect((x+y*8)*this.game.tile_size + (x+y*8+1)*(this.game.line_size), this.game.line_size, this.game.tile_size, this.game.tile_size);
			}
		}
		this.game.ctx.restore();
	}
	
	debugDraw() {
		this.game.ctx.save();
		//
		//this.game.ctx.strokeStyle = "blue";
		//this.game.ctx.lineWidth = 2.0;
		//var np = new Path2D();
		//np.moveTo(34, 34);
		//for (let i = 0; i<8; i++) {
		//	np.lineTo(34,34+66*i);
		//	np.lineTo(34+464, 34+66*i);
		//}
		//this.game.ctx.stroke(np);
		var npt = new Path2D();
		npt.moveTo(34+464, 34+464-10-2);
		npt.lineTo(34+464+10, 34+464-2);
		npt.lineTo(34+464, 34+464+10-2);
		this.game.ctx.fill(npt);
		//
		this.game.ctx.font = "24px serif";
		this.game.ctx.textBaseline = 'top';
		this.game.ctx.textAlign = 'center';
		this.game.ctx.fillStyle = 'red';
		var strone = "";
		var strtwo = "";
		for (var y = 0; y < 8; y++) {
			for (var x = 0; x < 8; x++) {
				strone = (y*8+x)+""
				strtwo = ('(' + x + ', ' + y + ')');
				this.game.ctx.fillText(strone, 32+2+x*64+x*2, 4+2+y*64+y*2);
				this.game.ctx.fillText(strtwo, 32+2+x*64+x*2, 36+2+y*64+y*2);
			}
		}
		this.game.ctx.restore();
	}
}