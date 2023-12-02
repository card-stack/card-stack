import { RookDeck } from '.';

describe('RookDeck', () => {
	it('creates 56 cards', () => {
		const deck = new RookDeck();

		expect(deck.size).toBe(56);
	});
});
