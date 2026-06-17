export interface EmojiColorItem {
  emoji: string
  /** * Array tuple schema matching the minified layout:
   * [0] Unicode Base-10 Integer
   * [1] Red (0-255)
   * [2] Green (0-255)
   * [3] Blue (0-255)
   * [4] Hex Color String
   */
  color: [number, number, number, number, string]
}

// The entire array representation of your emojis.json file
export type EmojiColorDataset = EmojiColorItem[]

export interface EmojiColorResult {
  unicodeInt: number
  r: number
  g: number
  b: number
  hex: string
}
