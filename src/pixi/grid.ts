export interface IGridItem {
	id: string;
	x: number;
	y: number;
	w: number;
	h: number;
	static?: boolean;
	moved?: boolean;
}

export class Grid {
	items: IGridItem[];

	constructor(items: IGridItem[]) {
		this.items = Grid.compact(items);
	}

	/**
	 * Определение коллизии элементов
	 * @static
	 * @param {IGridItem} first 1 Элемент
	 * @param {IGridItem} second 2 элемент
	 *
	 * @return {boolean} Есть ли коллизии
	 */
	static collision(first: IGridItem, second: IGridItem) {
		if (first == second) return false;
		if (first.x + first.w <= second.x) return false;
		if (first.x >= second.x + second.w) return false;
		if (first.y + first.h <= second.y) return false;
		if (first.y >= second.y + second.h) return false;

		return true;
	}

	/**
	 * Нахождение первой коллизии
	 * @static
	 * @param {IGridItem[]} [items]
	 *
	 * @param {IGridItem} [item]
	 */
	static getFirstCollision(items: IGridItem[], item: IGridItem) {
		for (let i = 0; i < items.length; i++) {
			if (Grid.collision(items[i], item)) return items[i];
		}

		return undefined;
	}

	/**
	 * Нахождение всех коллизий
	 * @static
	 * @param {IGridItem[]} [items] Все элементы
	 * @param  {IGridItem} [item] Перемещаемый элемент
	 *
	 * @return {IGridItem[]} Массив элементов с колизиями
	 */
	static getAllCollisions(items: IGridItem[], item: IGridItem) {
		return items.filter((l) => Grid.collision(l, item));
	}

	/**
	 * Получение всех статических элементов
	 * @param {IGridItem[]} items Все элементы
	 *
	 * @return {Object} Массив элементов
	 */
	static getStatics(items: IGridItem[]) {
		return items.filter((l) => l.static);
	}

	/**
	 * Сортировка строк
	 * @static
	 * @param {IGridItem[]} items Все элементы
	 *
	 * @return {IGridItem[]} Отсортированный массив элементов
	 */
	static sortItemsByRowCol(items: IGridItem[]) {
		return [...items].sort((a, b) => {
			if (a.y === b.y && a.x === b.x) return 0;
			if (a.y > b.y || (a.y === b.y && a.x > b.x)) return 1;

			return -1;
		});
	}

	/**
	 * TBD
	 * @static
	 * @param {IGridItem[]} items
	 * @param {IGridItem} item
	 * @param verticalCompact
	 * @returns {IGridItem}
	 */
	static compactItem(items: IGridItem[], item: IGridItem, verticalCompact?: boolean) {
		if (verticalCompact) {
			while (item.y > 0 && !Grid.getFirstCollision(items, item)) {
				item.y--;
			}
		}

		let collides;

		while ((collides = Grid.getFirstCollision(items, item))) {
			item.y = collides.y + collides.h;
		}

		return item;
	}

	/**
	 * TBD
	 * @static
	 * @param {IGridItem[]} items
	 * @param {boolean} verticalCompact
	 * @returns
	 */
	static compact(items: IGridItem[], verticalCompact?: boolean) {
		const compareWith = Grid.getStatics(items);

		const sorted = Grid.sortItemsByRowCol(items);

		const out = Array(items.length);

		for (let i = 0; i < sorted.length; i++) {
			let item = sorted[i];

			if (!item.static) {
				item = Grid.compactItem(compareWith, item, verticalCompact);

				compareWith.push(item);
			}

			out[items.indexOf(item)] = item;

			item.moved = false;
		}

		return out;
	}

	/**
	 * TBD
	 * @static
	 * @param {IGridItem[]} [items]
	 * @param {IGridItem} [item]
	 * @param {number} [x]
	 * @param {number} [y]
	 * @param {boolean} [isUserAction]
	 * @param {boolean} [preventCollision]
	 *
	 * @returns
	 */
	static moveElement(
		items: IGridItem[],
		item: IGridItem,
		x?: number,
		y?: number,
		isUserAction?: boolean,
		preventCollision?: boolean
	) {
		if (item?.static) return items;

		const oldX = item.x;
		const oldY = item.y;

		const movingUp = y && item.y > y;

		if (typeof x === "number") item.x = x;
		if (typeof y === "number") item.y = y;

		item.moved = true;

		let sorted = Grid.sortItemsByRowCol(items);
		if (movingUp) sorted = sorted.reverse();
		const collisions = Grid.getAllCollisions(sorted, item);

		if (preventCollision && collisions.length) {
			item.x = oldX;
			item.y = oldY;
			item.moved = false;

			return items;
		}

		for (let i = 0; i < collisions.length; i++) {
			const collision = collisions[i];

			if (collision.moved) continue;

			if (item.y > collision.y && item.y - collision.y > collision.h / 4) continue;

			if (collision.static) {
				items = Grid.moveElementAwayFromCollision(items, collision, item, isUserAction);
			} else {
				items = Grid.moveElementAwayFromCollision(items, item, collision, isUserAction);
			}
		}

		items = Grid.compact(items, true);

		return items;
	}

	/**
	 * TBD
	 * @param {IGridItem[]} [items]
	 * @param {any} [collisionWith]
	 * @param {IGridItem} [itemToMove]
	 * @param {boolean} [isUserAction]
	 *
	 * @returns
	 */
	static moveElementAwayFromCollision(
		items: IGridItem[],
		collisionWith: any,
		itemToMove: IGridItem,
		isUserAction?: boolean
	) {
		if (isUserAction) {
			const fakeItem = {
				x: itemToMove.x,
				y: itemToMove.y,
				w: itemToMove.w,
				h: itemToMove.h,
				id: "-1",
			};

			fakeItem.y = Math.max(collisionWith.y - itemToMove.h, 0);

			if (!Grid.getFirstCollision(items, fakeItem)) {
				return Grid.moveElement(items, itemToMove, undefined, fakeItem.y);
			}
		}

		return Grid.moveElement(items, itemToMove, undefined, itemToMove.y + 1);
	}
}
