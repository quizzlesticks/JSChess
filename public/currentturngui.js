class CurrentTurnGUI {
	small_canvas = undefined;
	small_ctx = undefined;
	
	constructor(game) {
		this.game = game;
		this.small_canvas = document.getElementById("small_canvas");
		this.small_ctx = this.small_canvas.getContext("2d");
		this.small_canvas.width = 64;
		this.small_canvas.height = 64;
		this.small_ctx.lineWidth = 4;
		this.small_ctx.strokeRect(0,0,64,64);
	}
	
	draw() {
		this.small_ctx.fillStyle = 'white';
		this.small_ctx.fillRect(0,0,64,64);
		this.small_ctx.fillStyle = 'black';
		if(this.game.black_turn) {
			this.small_ctx.fillRect(0,0,64,64);
		} else {
			this.small_ctx.strokeRect(0,0,64,64);
		}
	}
}