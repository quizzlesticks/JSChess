class InputHandler {
	game = undefined;
	que = [];
	last_pos = {x: 0, y: 0};
	delta = {x: 0, y: 0};
	mousedown = false;
	
	constructor(game) {
		this.game = game;
		this.handle = this.handle.bind(this);
		this.game.canvas.addEventListener("mouseup", this.handle);
		this.game.canvas.addEventListener("mousemove", this.handle);
		this.game.canvas.addEventListener("mousedown", this.handle);
	}
	
	handle(e) {
		if(!this.game.connected) return;
		if(e.button != 0) return;
		var x = e.x - 8;
		var y = e.y - 8;
		this.delta.x = x - this.last_pos.x;
		this.delta.y = y - this.last_pos.y;
		this.last_pos.x = x;
		this.last_pos.y = y;
		if(e.type == "mousedown") {
			this.mousedown = true;
			this.que.push({type: e.type, pos: this.last_pos});
		} else if(e.type == "mousemove" && this.mousedown) {
			this.que.push({type: "delta", pos: {x: this.last_pos.x, y: this.last_pos.y}, delta: {x: this.delta.x, y: this.delta.y}});
		} else if(e.type == "mouseup") {
			this.mousedown = false;
			this.que.push({type: e.type, pos: {x: this.last_pos.x, y: this.last_pos.y}});
		} else if(e.type == "mousemove") {
			this.que.push({type: "mouseover", pos: {x: this.last_pos.x, y: this.last_pos.y}});
		}
		if(this.que.length != 0 && !this.game.selecting_color.bool) {
			this.game.loop();
		}
	}
}