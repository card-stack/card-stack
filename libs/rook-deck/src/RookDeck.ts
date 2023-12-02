import { CardDeck } from '@card-stack/core';

import { RookCard } from '.';

export class RookDeck extends CardDeck<RookCard> {
	static override Card = RookCard;
}
