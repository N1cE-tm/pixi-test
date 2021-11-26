import * as PIXI from "pixi.js";
import Stats from "stats.js";

import { Viewport } from "pixi-viewport";
import { SpatialHash } from "pixi-cull";
import type { IViewportOptions } from "pixi-viewport";

export class Application extends PIXI.Application {
	element: Element | HTMLElement;
	cull: SpatialHash = new SpatialHash();
	viewport: Viewport = new Viewport();

	constructor(node: Element | HTMLElement, options?: any) {
		super(options?.application);
		this.element = node;
		if (options?.viewport) this.initViewport(options.viewport);
		if (options?.cull) this.initCull();
		if (options?.stats) this.initStats(options.stats);
		if (options?.autoResize) this.initResizer();

		node.appendChild(this.renderer.view);
	}

	private initViewport(config: IViewportOptions) {
		config = Object.assign({ interaction: this.renderer.plugins.interaction }, config);
		this.viewport = new Viewport(config);
		this.stage.addChild(this.viewport);
	}

	private initCull() {
		this.cull = new SpatialHash();
		PIXI.Ticker.shared.add(this.cullTicker.bind(this));
	}

	private cullTicker() {
		if (this.viewport.dirty) {
			this.cull.cull(this.viewport.getVisibleBounds());
			this.viewport.dirty = false;
		}
	}

	private initStats(node: HTMLElement | true) {
		const stats = new Stats();
		if (node === true) document.body.appendChild(stats.dom);
		else node.appendChild(stats.dom);
		PIXI.Ticker.shared.add(stats.end);
	}

	private initResizer() {
		const resize = (nodes: ResizeObserverEntry[]) => {
			const [node] = nodes;
			const { width, height } = node.contentRect;
			this.renderer.resize(width, height);
			this.viewport.resize(width, height);
			this.render();
		};
		const observer = new ResizeObserver(resize);

		observer.observe(this.element);
	}
}
