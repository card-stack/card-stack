import { EnumType, CardDeck, extractIndex, HexByte, CardSet, toHex } from '.';

export class Card<Suit extends number = number, Rank extends number = number> {
	static #instances = new Map<number, Card>();

	static getCard(id: number): Card | undefined;
	static getCard(card: Card): Card | undefined;
	static getCard(id: number | Card) {
		const index = extractIndex(id, HexByte.CARD_INDEX);

		return this.#instances.get(index);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static SUIT: EnumType<any, any> = {};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static RANK: EnumType<any, any> = {};

	static get #index() {
		return Math.max(0, ...this.#instances.keys());
	}

	static getIndex(offset = 0) {
		return this.#index + HexByte.CARD_INDEX * offset;
	}

	static isCard(obj: unknown): obj is Card {
		return obj instanceof Card;
	}

	static createSuitEnum<SuitType extends string, Suit extends number>(
		names: readonly SuitType[],
		offset = 0,
	): EnumType<SuitType, Suit> {
		return names.reduce((obj, name, index) => {
			const val = (index + 1 + offset) * HexByte.CARD_SUIT;

			return Object.defineProperties(obj, {
				[name]: {
					value: val,
					enumerable: true,
					writable: false,
					configurable: false,
				},
				[val]: {
					value: name,
					enumerable: false,
					writable: false,
					configurable: false,
				},
			});
		}, {} as EnumType<SuitType>);
	}

	static createRankEnum<RankType extends string, Rank extends number>(
		names: readonly RankType[],
		offset = 0,
	): EnumType<RankType, Rank> {
		return names.reduce((obj, name, index) => {
			const val = (index + 1 + offset) * HexByte.CARD_RANK;

			return Object.defineProperties(obj, {
				[name]: {
					value: val,
					enumerable: true,
					writable: false,
					configurable: false,
				},
				[val]: {
					value: name,
					enumerable: false,
					writable: false,
					configurable: false,
				},
			});
		}, {} as EnumType<RankType>);
	}

	static __RESET_FOR_TESTING_ONLY__() {
		if (!process?.env?.['JEST_WORKER_ID']) {
			throw new Error(
				'__RESET_FOR_TESTING_ONLY__ should only be called from jest',
			);
		}

		Card.#instances.clear();
	}

	readonly suit: Suit;
	readonly rank: Rank;
	readonly deck?: CardDeck<Card<Suit, Rank>>;
	parent?: CardSet;
	readonly index = Card.getIndex(1);
	protected readonly ctor = this.constructor as typeof Card;

	get id() {
		return (
			(this.parent?.index ?? 0) +
			(this.deck?.index ?? 0) +
			this.index +
			this.suit +
			this.rank
		);
	}

	get deckIndex() {
		return this.deck?.index;
	}

	get parentIndex() {
		return this.parent?.index;
	}

	get type() {
		return `${this.ctor.SUIT[this.suit]}_${this.ctor.RANK[this.rank]}`;
	}

	constructor(
		suit: Suit,
		rank: Rank,
		deck?: CardDeck<Card<Suit, Rank>>,
		parent?: CardSet,
	) {
		this.suit = suit;
		this.rank = rank;
		this.deck = deck;
		this.parent = parent;

		Card.#instances.set(this.index, this);
	}

	[Symbol.for('nodejs.util.inspect.custom')]() {
		return `${this.ctor.name}<${this.type}, ${toHex(this.id)}>`;
	}

	[Symbol.toPrimitive](hint: unknown) {
		switch (hint) {
			case 'number':
				return this.id;
			case 'string':
				return this.type;
			default:
				return null;
		}
	}

	isSameSuit(card: Card) {
		return this.suit === card.suit;
	}

	isSameRank(card: Card) {
		return this.rank === card.rank;
	}

	isHigherRank(card: Card) {
		return this.rank > card.rank;
	}

	isLowerRank(card: Card) {
		return this.rank < card.rank;
	}

	diff(card: Card, ...keys: CardSortKey[]) {
		if (!keys.length) {
			keys.push(CardSortKey.SUIT, CardSortKey.RANK);
		}

		const [a, b] = keys.reduce(
			(result, key) => {
				return [result[0] + +(this[key] ?? 0), result[1] + +(card[key] ?? 0)];
			},
			[0, 0],
		);

		return a - b;
	}

	diffSuit(card: Card) {
		return this.diff(card, CardSortKey.SUIT) / HexByte.CARD_SUIT;
	}

	diffRank(card: Card) {
		return this.diff(card, CardSortKey.RANK) / HexByte.CARD_RANK;
	}
}

export type CardCtor<
	Suit extends number = number,
	Rank extends number = number,
> = typeof Card<Suit, Rank>;

export type CardSuit<CardType extends Card> = CardType extends Card<
	infer Suit,
	number
>
	? Suit
	: never;

export type CardRank<CardType extends Card> = CardType extends Card<
	number,
	infer Rank
>
	? Rank
	: never;

export enum CardSortKey {
	'PARENT' = 'parent',
	'DECK' = 'deck',
	'INDEX' = 'index',
	'SUIT' = 'suit',
	'RANK' = 'rank',
}

export enum CardSortOrder {
	'ASC' = 'asc',
	'DESC' = 'desc',
	'RAND' = 'rand',
}
