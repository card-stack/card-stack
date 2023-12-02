import { CardDeck } from '@card-stack/core';

import { StandardCard } from '.';

export class StandardDeck extends CardDeck<StandardCard> {
	static override Card = StandardCard;
}
