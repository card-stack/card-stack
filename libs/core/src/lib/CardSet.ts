import {
	Card,
	extractIndex,
	HexByte,
	CardSortKey,
	CardSortOrder,
	// toHex,
} from '.';

export abstract class CardSet<CardType extends Card = Card> {
	static #instances = new Map<number, CardSet>();
	static getCardSet(id: number) {
		const index = extractIndex(id, HexByte.PARENT_INDEX);

		return this.#instances.get(index);
	}

	static get #index() {
		return Math.max(0, ...this.#instances.keys());
	}

	static getIndex(offset = 0) {
		const index = this.#index;
		offset = Math.max(0, offset);
		const inc = HexByte.PARENT_INDEX * offset;
		const result = index + inc;
		return result;
	}

	static isCardSet(obj: unknown): obj is CardSet {
		return obj instanceof CardSet;
	}

	static __RESET_FOR_TESTING_ONLY__() {
		if (!process?.env?.['JEST_WORKER_ID']) {
			throw new Error(
				'__RESET_FOR_TESTING_ONLY__ should only be called from jest',
			);
		}

		CardSet.#instances.clear();
	}

	index: number = CardSet.getIndex(1);

	parent?: CardSet;

	get size() {
		return this.cards.length;
	}

	protected readonly cards: CardType[] = [];

	protected readonly ctor = this.constructor as typeof CardSet;

	constructor(cards?: CardType[], parent?: CardSet);
	constructor(parent?: CardSet);
	constructor(...args: unknown[]) {
		if (Array.isArray(args[0])) {
			this.cards.push(...(args.shift() as CardType[]));

			for (const card of this.cards) {
				card.parent = this;
			}
		}

		if (args[0] instanceof CardSet) {
			this.parent = args.shift() as CardSet<CardType>;
		}

		CardSet.#instances.set(this.index, this);
	}

	*[Symbol.iterator]() {
		for (const card of this.cards) {
			yield card;
		}
	}

	draw(count?: number, index?: number): CardType[];
	draw(count?: number, random?: boolean): CardType[];
	draw(count?: number, indexOrRandom?: number | boolean): CardType[];
	draw(count = 1, indexOrRandom: number | boolean = 0) {
		if (indexOrRandom === true) {
			const result = [];

			while (count > 0 && result.length < count) {
				result.push(...this.draw(1, Math.floor(Math.random() * this.size)));
			}

			return result;
		}

		const index = typeof indexOrRandom === 'number' ? indexOrRandom : 0;

		return this.cards.splice(index, count);
	}

	shuffle() {
		let count = this.size;

		while (count) {
			this.cards.push(...this.draw(1, Math.floor(Math.random() * count)));
			count--;
		}

		return this;
	}

	sortBy(key: CardSortKey, order?: CardSortOrder): this;
	sortBy(keys: CardSortKey[], orders: CardSortOrder[]): this;
	sortBy(k: unknown, o: unknown) {
		const keys = Array.isArray(k) ? k : [k];
		const orders = Array.isArray(o) ? o : [o ?? CardSortOrder.ASC];
		const conditions = keys.map((key, index) => [key, orders[index]]);
		this.cards.sort((a, b) => {
			for (const [key, order] of conditions) {
				let result = 0;

				switch (key) {
					case CardSortKey.PARENT:
						result = (a.parent?.index ?? 0) - (b.parent?.index ?? 0);
						break;
					case CardSortKey.DECK:
						result = (a.deck?.index ?? 0) - (b.deck?.index ?? 0);
						break;
					case CardSortKey.INDEX:
						result = a.index - b.index;
						break;
					case CardSortKey.SUIT:
						result = a.suit - b.suit;
						break;
					case CardSortKey.RANK:
						result = a.rank - b.rank;
						break;
				}

				if (result) {
					if (order === CardSortOrder.DESC) {
						result *= -1;
					}

					return result;
				}
			}
			return 0;
		});

		return this;
	}

	sort() {
		this.cards.sort((a, b) => a.index - b.index);
	}

	isAncestor(card: Card): boolean;
	isAncestor(cardSet: CardSet): boolean;
	isAncestor(obj: Card | CardSet) {
		let parent = obj?.parent;

		while (parent instanceof CardSet) {
			if (parent === this) {
				return true;
			}

			parent = parent.parent;
		}

		return false;
	}
}
