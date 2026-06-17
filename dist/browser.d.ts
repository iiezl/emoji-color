import { EmojiColor } from ".";
declare global {
    interface Window {
        EmojiColor: typeof EmojiColor;
    }
}
export { EmojiColor };
