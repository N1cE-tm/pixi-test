import * as PIXI from "pixi.js";

export class Day extends PIXI.Container {
	dayOfWeek: string = "Пн";
	number: number = 1;
	isToday: boolean = false;

	constructor(number: number, dayOfWeek: string, isToday?: boolean) {
		super();

		this._width = 240;
		this._height = 40;

		this.number = number;
		this.dayOfWeek = dayOfWeek;
		this.isToday = !!isToday;

		this.init();
	}

	init() {
		const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
		bg.tint = 0x1e1e1e;
		bg.width = this._width;
		bg.height = this._height;

		const day = new PIXI.Text(this.dayOfWeek, {
			fontFamily: "Gotham",
			fontSize: 12,
			fontWeight: "400",
			fill: "#A0A0A1",
		});
		day.roundPixels = true;
		day.x = this._width / 2;
		day.y = 4;
		day.anchor.set(0.5, 0);

		const number = new PIXI.Text(`${this.number}`, {
			fontFamily: "Gotham",
			fontSize: 15,
			fontWeight: "500",
			fill: "white",
		});
		number.roundPixels = true;
		number.x = this._width / 2;
		number.y = 18;
		number.anchor.set(0.5, 0);

		this.addChild(bg);
		this.addChild(day);
		this.addChild(number);
	}
}
