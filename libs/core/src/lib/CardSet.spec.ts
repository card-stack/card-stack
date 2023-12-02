import {
	Card,
	CardDeck,
	CardSet,
	CardSortKey,
	HexByte,
	// toHex
} from '.';

describe('CardSet', () => {
	afterEach(() => {
		Card.__RESET_FOR_TESTING_ONLY__();
		CardSet.__RESET_FOR_TESTING_ONLY__();
		CardDeck.__RESET_FOR_TESTING_ONLY__();
	});

	class TestCard extends Card {
		static override readonly SUIT = Card.createSuitEnum(['A', 'B', 'C']);
		static override readonly RANK = Card.createRankEnum([
			'ONE',
			'TWO',
			'THREE',
			'FOUR',
		]);
	}

	class TestCardSet extends CardSet<TestCard> {}

	class TestCardDeck extends CardDeck<TestCard> {
		static override Card = TestCard;
	}

	const createDeck = () => new TestCardDeck();
	const createSet = (cards = [...createDeck()], parent?: CardSet) =>
		new TestCardSet([...cards], parent);

	it('sets an auto-incremented index', () => {
		const set1 = new TestCardSet();
		const set2 = new TestCardSet();
		const set3 = new TestCardSet();
		const set4 = new TestCardSet();

		expect(set1.index).toBeLessThan(set2.index);
		expect(set2.index).toBeLessThan(set3.index);
		expect(set3.index).toBeLessThan(set4.index);

		expect(set2.index).toBe(set1.index + HexByte.PARENT_INDEX);
		expect(set3.index).toBe(set2.index + HexByte.PARENT_INDEX);
		expect(set4.index).toBe(set3.index + HexByte.PARENT_INDEX);
	});

	describe('CardSet.getCardSet', () => {
		const set1 = new TestCardSet();
		const set2 = new TestCardSet();

		const test1 = CardSet.getCardSet(set1.index);
		const test2 = CardSet.getCardSet(set2.index);

		expect(test1).toBeInstanceOf(TestCardSet);
		expect(test1).toBeInstanceOf(CardSet);
		expect(test1).toBe(set1);

		expect(test2).toBeInstanceOf(TestCardSet);
		expect(test2).toBeInstanceOf(CardSet);
		expect(test2).toBe(set2);

		expect(set1).not.toBe(set2);
	});

	describe('CardSet.getIndex', () => {
		it('increment based on offset', () => {
			const index1 = CardSet.getIndex();
			const index2 = CardSet.getIndex(2);
			const index3 = CardSet.getIndex(1);

			expect(index2).toBe(index1 + HexByte.PARENT_INDEX * 2);
			expect(index3).toBe(index1 + HexByte.PARENT_INDEX);
		});
	});

	describe('CardSet.isCardSet', () => {
		it('returns true for CardSet instances', () => {
			expect(CardSet.isCardSet(new TestCardSet())).toBe(true);
		});

		it('returns false for non-CardSet instances', () => {
			expect(CardSet.isCardSet({})).toBe(false);
			expect(CardSet.isCardSet([])).toBe(false);
			expect(CardSet.isCardSet(0)).toBe(false);
			expect(CardSet.isCardSet('')).toBe(false);
			expect(CardSet.isCardSet(null)).toBe(false);
			expect(CardSet.isCardSet(undefined)).toBe(false);
		});
	});

	describe('.draw', () => {
		const setup = ({
			drawCount = undefined as number | undefined,
			index = undefined as number | undefined,
			random = undefined as boolean | undefined,
		} = {}) => {
			const set = createSet();
			const cards = [...set];
			const drawn = set.draw(drawCount, random || index);

			return {
				drawCount: drawCount || 1,
				index: index || 0,
				random: !!random,
				cards,
				set,
				drawn,
			};
		};

		it('draws 1 card by default', () => {
			const { drawn, drawCount, set, cards } = setup();

			expect(drawn.length).toBeGreaterThan(0);
			expect(drawn.length).toBe(drawCount);
			expect(set.size).toBeLessThan(cards.length);
			expect(set.size).toBe(cards.length - drawCount);
			expect(drawn).toEqual([cards[0]]);
		});

		it('draws a number of cards', () => {
			const { drawn, drawCount, set, cards } = setup({
				drawCount: 3,
			});

			expect(drawn.length).toBeGreaterThan(0);
			expect(drawn.length).toBe(drawCount);
			expect(set.size).toBeLessThan(cards.length);
			expect(set.size).toBe(cards.length - drawCount);
			expect(drawn).toEqual([cards[0], cards[1], cards[2]]);
		});

		it('accepts an index', () => {
			const { drawn, drawCount, set, cards } = setup({
				index: 4,
				drawCount: 4,
			});

			expect(drawn.length).toBeGreaterThan(0);
			expect(drawn.length).toBe(drawCount);
			expect(set.size).toBeLessThan(cards.length);
			expect(set.size).toBe(cards.length - drawCount);
			expect(drawn).toEqual([cards[4], cards[5], cards[6], cards[7]]);
		});

		it('accepts a negative index', () => {
			const { drawn, drawCount, set, cards } = setup({
				index: -4,
				drawCount: 3,
			});

			expect(drawn.length).toBeGreaterThan(0);
			expect(drawn.length).toBe(drawCount);
			expect(set.size).toBeLessThan(cards.length);
			expect(set.size).toBe(cards.length - drawCount);
			expect(drawn).toEqual([cards.at(-4), cards.at(-3), cards.at(-2)]);
		});
	});

	describe('.shuffle', () => {
		it('shuffles the cards', () => {
			const set = createSet();
			const cards = [...set];

			expect([...set]).toEqual(cards);

			set.shuffle();

			expect([...set]).not.toEqual(cards);
		});
	});

	describe('.sortBy', () => {
		const deck1 = createDeck();
		const deck2 = createDeck();
		const deck3 = createDeck();
		const cards = [...deck2, ...deck1, ...deck3].reverse();

		it('sorts by index', () => {
			const set = new TestCardSet(cards);

			set.sortBy(CardSortKey.INDEX);

			expect([...set]).toEqual([...deck1, ...deck2, ...deck3]);
		});

		it('sorts by rank', () => {
			const set = new TestCardSet(cards);
			set.sortBy(CardSortKey.RANK);

			expect([...set]).toMatchSnapshot();
		});

		it('sorts by suit', () => {
			const set = new TestCardSet(cards);
			set.sortBy(CardSortKey.SUIT);

			expect([...set]).toMatchSnapshot();
		});

		it('sorts by index', () => {
			const set = new TestCardSet(cards);
			set.sortBy(CardSortKey.INDEX);

			expect([...set]).toMatchSnapshot();
		});

		it('sorts by deck', () => {
			const set = new TestCardSet(cards);
			set.sortBy(CardSortKey.DECK);

			expect([...set]).toMatchSnapshot();
		});
	});

	describe('.sort', () => {
		it('reverts to original order', () => {
			const cards = [...createDeck()];
			const set = createSet(cards);

			expect([...set]).toEqual(cards);

			set.shuffle();

			expect([...set]).not.toEqual(cards);

			set.sort();

			expect([...set]).toEqual(cards);
		});
	});

	describe('.isAncestor', () => {
		it('accepts a Card', () => {
			const deck = createDeck();
			const set1 = createSet([...deck]);
			const set2 = createSet([...set1]);
			const set3 = createSet([...set2], set2);

			expect(set1.isAncestor([...set3][0])).toBe(false);
			expect(set2.isAncestor([...set3][0])).toBe(true);
		});
	});
});
