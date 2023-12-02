export type EnumType<
	Key extends string = string,
	Val extends number = number,
> = Record<Key & string, Val & number> & Record<Val & number, Key & string>;
// export type EnumType<
// 	Key extends string = string,
// 	Val extends number = number,
// > = {
// 	[K in Key | Val]: K extends Val ? Key : Val;
// };

export type EnumKey<Enum extends EnumType> = keyof Enum & string;
export type EnumValue<Enum extends EnumType> = Enum[EnumKey<Enum>] & number;

export enum HexByte {
	CARD_RANK = 0x0000000001,
	CARD_SUIT = 0x0000000100,
	CARD_INDEX = 0x0000010000,
	DECK_INDEX = 0x0001000000,
	PARENT_INDEX = 0x0100000000,
}
