import { EmojiColorDataset, EmojiColorItem, EmojiColorResult } from "./types";
export declare class EmojiColor {
    private static readonly REMOTE_URL;
    private static readonly FALLBACK_DATASET;
    private static _dataset;
    private static _emojiMap;
    private static isInitialized;
    private constructor();
    private static ensureInitialized;
    private static rebuildInternalMaps;
    static fetch(): Promise<boolean>;
    static getDataset(): EmojiColorDataset;
    static toColor(emoji: string): EmojiColorResult | null;
    static rgbToClosest(r: number, g: number, b: number): EmojiColorItem;
    static hexToClosest(hex: string): EmojiColorItem | null;
    private static hexToRgb;
}
export * from "./types";
