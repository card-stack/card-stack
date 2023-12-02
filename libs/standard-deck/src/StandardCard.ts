import { Card } from '@card-stack/core';

export const StandardSuit = Card.createSuitEnum([
	'CLUB',
	'DIAMOND',
	'HEART',
	'SPADE',
] as const);
export const StandardRank = Card.createRankEnum([
	'ACE',
	'TWO',
	'THREE',
	'FOUR',
	'FIVE',
	'SIX',
	'SEVEN',
	'EIGHT',
	'NINE',
	'TEN',
	'JACK',
	'QUEEN',
	'KING',
]);

export class StandardCard extends Card {
	static override SUIT = StandardSuit;
	static override RANK = StandardRank;
}
