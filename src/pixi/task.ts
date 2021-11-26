import * as PIXI from "pixi.js";

export class Task extends PIXI.Container {
	text: string;
	borderRadius: number = 4;

	constructor(text: string) {
		super();

		this._width = 220;
		this._height = 32;
		this.interactive = true;
		this.buttonMode = true;
		this.text = text;

		this.init();
	}

	init() {
		const bg = new PIXI.Graphics();
		bg.beginFill(0x2c2c2c);
		bg.drawRoundedRect(0, 0, this._width, this._height, this.borderRadius);
		bg.endFill();

		const title = new PIXI.Text(this.text, {
			fontFamily: "Gotham",
			fontSize: 13,
			fontWeight: "500",
			fill: "#DCD2D2",
		});
		title.roundPixels = true;
		title.x = 6;
		title.y = this._height / 2;
		title.anchor.set(0, 0.5);

		this.addChild(bg);
		this.addChild(title);
	}
}
