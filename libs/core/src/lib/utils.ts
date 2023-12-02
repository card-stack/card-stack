import { HexByte, Card, CardDeck, CardSet } from '.';

export const toHex = (val?: number) =>
	typeof val === 'number'
		? '0x' +
		  Math.abs(Number(val ?? 0))
				.toString(16)
				.padStart(10, '0')
				.toUpperCase()
		: undefined;

export const extractIndex = <T extends number | Card | CardDeck | CardSet>(
	id: T,
	mask: HexByte | number,
) => {
	// round down to mask
	let result = Math.floor(Number(id) / mask);

	// truncate to 1 byte
	result = result & 0xff;

	// multiply back up to mask
	result = result * mask;

	return result;
};
