import * as PIXI from "pixi.js";

export interface IDayOptions {
	day: number;
	dayOfWeek?: string;
	isToday?: boolean;
	month?: string;
}

export class Day extends PIXI.Container {
	day: number = 1;
	dayOfWeek?: string;
	isToday: boolean = false;
	month: string | undefined = undefined;

	constructor(options: IDayOptions) {
		super();

		this._width = 240;
		this._height = 40;

		this.day = options.day;
		this.dayOfWeek = options.dayOfWeek;
		this.isToday = !!options.isToday;
		this.month = options.month;

		this.init();
	}

	init() {
		this.createBg();
		this.createNumber(this.day.toString());

		if (this.dayOfWeek) this.createDay(this.dayOfWeek);
		if (this.isToday) this.createToday();
		if (this.month && !this.isToday) this.createMonth(this.month);
	}

	private createBg() {
		const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
		bg.tint = 0x1e1e1e;
		bg.width = this._width;
		bg.height = this._height;
		this.addChild(bg);
	}

	private createDay(label: string) {
		const text = new PIXI.Text(label, { fontFamily: "Gotham", fontSize: 12, fontWeight: "400", fill: "#A0A0A1" });
		text.roundPixels = true;
		text.x = this._width / 2;
		text.y = 4;
		text.anchor.set(0.5, 0);
		this.addChild(text);
	}

	private createNumber(label: string) {
		const text = new PIXI.Text(label, { fontFamily: "Gotham", fontSize: 15, fontWeight: "500", fill: "white" });
		text.roundPixels = true;
		text.x = this._width / 2;
		text.y = 18;
		text.anchor.set(0.5, 0);
		this.addChild(text);
	}

	private createToday() {
		const text = new PIXI.Text("СЕГОДНЯ", {
			fontFamily: "Gotham",
			fontSize: 10,
			fontWeight: "500",
			fill: "#FFD374",
		});
		text.roundPixels = true;
		text.x = this._width / 4;
		text.y = this._height / 2;
		text.anchor.set(0.5, 0.5);
		this.addChild(text);

		const border = new PIXI.Graphics();
		border.lineStyle(1, 0xffd374, 0.5, 0);
		border.drawRoundedRect(
			Math.floor(text.x - text.width / 2 - 4),
			Math.floor(text.y - text.height / 2 - 2),
			text.width + 8,
			text.height + 4,
			4
		);
		border.endFill();

		this.addChild(text);
		this.addChild(border);
	}

	private createMonth(label: string) {
		const text = new PIXI.Text(label.toUpperCase(), {
			fontFamily: "Gotham",
			fontSize: 10,
			fontWeight: "500",
			fill: "#AEC1B2",
		});
		text.roundPixels = true;
		text.x = this._width / 4;
		text.y = this._height / 2;
		text.anchor.set(0.5, 0.5);
		this.addChild(text);

		const border = new PIXI.Graphics();
		border.lineStyle(1, 0xaec1b2, 0.5, 0);
		border.drawRoundedRect(
			Math.floor(text.x - text.width / 2 - 4),
			Math.floor(text.y - text.height / 2 - 2),
			text.width + 8,
			text.height + 4,
			4
		);

		border.endFill();

		this.addChild(text);
		this.addChild(border);
	}
}
