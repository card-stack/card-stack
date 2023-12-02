import { Card, toHex } from '.';

module.exports = {
	test: (val: unknown) => val instanceof Card,
	serialize: (val: Card) => toHex(val.id),
};
