import "./style.css";

import { Application } from "@/pixi/application";
import { Day } from "@/pixi/day";
import { Task } from "@/pixi/task";

const node = document.querySelector<HTMLElement>("#app") || document.body;

const app = new Application(node, {
	application: {
		width: document.documentElement.clientWidth,
		height: document.documentElement.clientHeight,
		resolution: window.devicePixelRatio || 1,
		antialias: true,
		autoDensity: true,
	},
	viewport: {
		worldWidth: 365 * 240,
		worldHeight: Infinity,
	},
	cull: true,
	stats: true,
	autoResize: true,
});

app.viewport
	.drag({ wheel: true, clampWheel: true })
	.pinch()
	.decelerate()
	.clamp({ direction: "all", underflow: "top - left" })
	.clampZoom({ minScale: 1, maxScale: 1.5 });

for (let i = 0; i < 365; i++) {
	const day = new Day({
		day: i + 1,
		dayOfWeek: i % 2 == 0 ? "Пн" : "Вт",
		isToday: i === 5,
		month: i % 30 == 0 ? "месяц" : undefined,
	});
	day.x = i * 240;

	app.viewport.addChild(day);
	app.cull.add(day);
}

// let tasks = [];
// for (let row = 2; row < 12; row++) {
// 	for (let col = 0; col < 4; col++) {
// 		tasks.push({
// 			visible: false,
// 			title: `Generated ${row}_${col}`,
// 			x: row,
// 			y: col,
// 			w: 1,
// 			h: 1,
// 		});
// 	}
// }

// tasks.forEach((task) => {
// 	const t = new Task(task.title);
// 	t.x = 10 + task.x * 240;
// 	t.y = 100 + task.y * 40;

// 	app.viewport.addChild(t);
// 	app.cull.add(t, false);
// });

for (let x = 0; x < 365; x++) {
	for (let y = 0; y < 10; y++) {
		const task = new Task(`Task (${x} - ${y})`);
		task.x = 10 + x * 240;
		task.y = 100 + y * 40;

		app.viewport.addChild(task);
		app.cull.add(task, false);
	}
	0;
}

// setTimeout(() => {
// 	for (let x = 0; x < 365; x++) {
// 		for (let y = 10; y < 20; y++) {
// 			const task = new Task(`Task (${x} - ${y})`);
// 			task.x = 10 + x * 240;
// 			task.y = 100 + y * 40;

// 			app.viewport.addChild(task);
// 			app.cull.add(task, false);
// 		}
// 		0;
// 	}
// }, 5000);

export { app };
