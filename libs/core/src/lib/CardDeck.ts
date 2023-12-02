import { Card, CardSet, extractIndex, HexByte, CardCtor, toHex } from '.';

export abstract class CardDeck<
	CardType extends Card = Card,
> extends CardSet<CardType> {
	static #instances = new Map<number, CardDeck>();
	static getCardDeck(id: number): CardDeck | undefined;
	static getCardDeck(card: Card): CardDeck | undefined;
	static getCardDeck(deck: CardDeck): CardDeck | undefined;
	static getCardDeck(id: number | Card | CardDeck) {
		const index = extractIndex(id, HexByte.DECK_INDEX);

		return this.#instances.get(index);
	}

	static get #index() {
		return Math.max(0, ...this.#instances.keys());
	}

	static override getIndex(offset = 0) {
		return this.#index + HexByte.DECK_INDEX * offset;
	}

	static override __RESET_FOR_TESTING_ONLY__() {
		if (!process?.env?.['JEST_WORKER_ID']) {
			throw new Error(
				'__RESET_FOR_TESTING_ONLY__ should only be called from jest',
			);
		}

		CardDeck.#instances.clear();
	}

	static get SUITS() {
		return Object.keys(this.Card.SUIT).map((k) => this.Card.SUIT[k]);
	}

	static get RANKS() {
		return Object.keys(this.Card.RANK).map((k) => this.Card.RANK[k]);
	}

	static Card: CardCtor;

	override index = CardDeck.getIndex(1);

	protected override readonly ctor = this.constructor as typeof CardDeck;

	constructor() {
		super();

		for (const suit of this.ctor.SUITS) {
			for (const rank of this.ctor.RANKS) {
				this.cards.push(new this.ctor.Card(suit, rank, this) as CardType);
			}
		}

		CardDeck.#instances.set(this.index, this);
	}

	[Symbol.toPrimitive](hint: unknown) {
		switch (hint) {
			case 'number':
				return this.index;
			case 'string':
				return toHex(this.index);
			default:
				return null;
		}
	}

	override draw(count?: number, index?: number): CardType[];
	override draw(count: number, random: true): CardType[];
	override draw(count = 1, indexOrRandom: number | true = -1) {
		const result = [];

		if (indexOrRandom === true) {
			while (count > 0 && result.length < count) {
				result.push(...this.draw(1, Math.floor(Math.random() * this.size)));
			}
		}

		if (typeof indexOrRandom === 'number') {
			result.push(...this.cards.slice(indexOrRandom, indexOrRandom + count));
		}

		return result;
	}
}
