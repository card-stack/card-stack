import { CardDeck, Card } from '.';

class TestCard extends Card {}
class TestDeck extends CardDeck {
	static override readonly Card = TestCard;
}

describe('CardDeck', () => {
	it('sets an auto-incremented index', () => {
		const deck1 = new TestDeck();
		const deck2 = new TestDeck();

		expect(deck1.index).toBe(0x1000000);
		expect(deck2.index).toBe(0x2000000);
	});

	describe('CardDeck.getCardDeck', () => {});

	describe('CardDeck.getIndex', () => {});

	describe('.draw', () => {});
});
