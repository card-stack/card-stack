import { StandardDeck } from '.';

describe('StandardDeck', () => {
	it('creates 52 cards', () => {
		const deck = new StandardDeck();

		expect(deck.size).toBe(52);
	});
});
