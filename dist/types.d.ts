export interface EmojiColorItem {
    emoji: string;
    color: [number, number, number, number, string];
}
export type EmojiColorDataset = EmojiColorItem[];
export interface EmojiColorResult {
    unicodeInt: number;
    r: number;
    g: number;
    b: number;
    hex: string;
}
