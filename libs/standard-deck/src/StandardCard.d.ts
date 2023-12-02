import { Card } from '@card-stack/core';
export declare const StandardSuit: import("@card-stack/core").EnumType<string, number>;
export declare const StandardRank: import("@card-stack/core").EnumType<"ACE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "SIX" | "SEVEN" | "EIGHT" | "NINE" | "TEN" | "JACK" | "QUEEN" | "KING", number>;
export declare class StandardCard extends Card {
    static SUIT: import("@card-stack/core").EnumType<string, number>;
    static RANK: import("@card-stack/core").EnumType<"ACE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "SIX" | "SEVEN" | "EIGHT" | "NINE" | "TEN" | "JACK" | "QUEEN" | "KING", number>;
}
