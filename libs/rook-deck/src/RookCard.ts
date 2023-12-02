import { Card } from '@card-stack/core';

export const RookSuit = Card.createSuitEnum([
	'RED',
	'GREEN',
	'YELLOW',
	'BLUE',
] as const);
export const RookRank = Card.createRankEnum([
	'ONE',
	'TWO',
	'THREE',
	'FOUR',
	'FIVE',
	'SIX',
	'SEVEN',
	'EIGHT',
	'NINE',
	'TEN',
	'ELEVEN',
	'TWELVE',
	'THIRTEEN',
	'FOURTEEN',
]);

export class RookCard extends Card {
	static override SUIT = RookSuit;
	static override RANK = RookRank;
}
