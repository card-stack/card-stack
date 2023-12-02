import { Card } from '.';

describe('Card', () => {
	it('sets an auto-incremented index', () => {
		const card1 = new Card(0, 0);
		const card2 = new Card(0, 0);

		expect(card1.index).toBe(0x10000);
		expect(card2.index).toBe(0x20000);

		expect(card1.id).toBe(card1.index);
		expect(card2.id).toBe(card2.index);
	});

	it('includes rank and suit in id', () => {
		const card = new Card(0x0a000, 0xa);

		expect(card.id & 0x0ffff).toBe(0x0a00a);
	});

	describe('Card.getCard', () => {});
	describe('Card.getIndex', () => {});
	describe('Card.isCard', () => {});
	describe('Card.createSuitEnum', () => {});
	describe('Card.createRankEnum', () => {});

	describe('.isSameSuit', () => {});
	describe('.isSameRank', () => {});
	describe('.isHigherRank', () => {});
	describe('.isLowerRank', () => {});
	describe('.diff', () => {});
	describe('.diffSuit', () => {});
	describe('.diffRank', () => {});
});
