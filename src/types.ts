export interface EmojiColorItem {
  emoji: string
  unicode: number
  /** * Array tuple schema:
   * [0] Red (0-255)
   * [1] Green (0-255)
   * [2] Blue (0-255)
   * [3] Hex Color String
   */
  color: [number, number, number, string]
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
