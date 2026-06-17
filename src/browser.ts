import { EmojiColor } from "."

// Extend the Window interface so TypeScript doesn't complain about the custom property
declare global {
  interface Window {
    EmojiColor: typeof EmojiColor
  }
}

// Attach the stuff to the global window object
if (typeof window !== "undefined") {
  window.EmojiColor = EmojiColor
}

export { EmojiColor }
