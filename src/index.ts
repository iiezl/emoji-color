import { EmojiColorDataset, EmojiColorItem, EmojiColorResult } from "./types"

export class EmojiColor {
  private static readonly REMOTE_URL =
    "https://raw.githubusercontent.com/user-lezi/emoji-color/refs/heads/main/emojis.json"

  // High-fidelity fallback database consisting of 5 common diverse entries
  private static readonly FALLBACK_DATASET: EmojiColorDataset = [
    { emoji: "🥑", unicode: 129361, color: [118, 179, 67, "#76b343"] },
    { emoji: "🔴", unicode: 128308, color: [190, 25, 49, "#be1931"] },
    { emoji: "🍉", unicode: 127817, color: [234, 89, 110, "#ea596e"] },
    { emoji: "🐳", unicode: 128051, color: [56, 189, 248, "#38bdf8"] },
    { emoji: "🖤", unicode: 128420, color: [30, 41, 59, "#1e293b"] },
  ]

  private static _dataset: EmojiColorDataset | null = null
  private static _emojiMap: Map<string, EmojiColorItem> | null = null
  private static isInitialized = false

  private constructor() {
    throw new Error("EmojiColor is a static utility class and cannot be instantiated.")
  }

  /**
   * Initializes data arrays synchronously using local files or compiled fallbacks.
   */
  private static ensureInitialized(): void {
    if (this.isInitialized) return

    try {
      // @ts-ignore 1. Try resolving local filesystem asset synchronously via standard require paths
      const localData = require("../emojis.json")
      this._dataset = (localData.default || localData) as EmojiColorDataset
    } catch (error) {
      // 2. Fallback to the 5-item static default array if the file is missing or in-browser
      this._dataset = [...this.FALLBACK_DATASET]
    }

    this.rebuildInternalMaps()
    this.isInitialized = true
  }

  /**
   * Generates fast lookup records for memory pools
   */
  private static rebuildInternalMaps(): void {
    if (this._dataset) {
      this._emojiMap = new Map(this._dataset.map((item) => [item.emoji, item]))
    }
  }

  /**
   * Explicitly download the live macro file from GitHub.
   * Updates the internal static cache records seamlessly in real-time.
   * @returns Promise resolving to true if the live fetch was successful
   */
  public static async fetch(): Promise<boolean> {
    try {
      const response = await fetch(this.REMOTE_URL)
      if (!response.ok) throw new Error(`HTTP status error: ${response.status}`)

      const remoteData = (await response.json()) as EmojiColorDataset
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        this._dataset = remoteData
        this.rebuildInternalMaps()
        this.isInitialized = true
        return true
      }
      return false
    } catch (err) {
      console.error("EmojiColor: Manual .fetch() pipeline failed.", err)
      // Fall back safely to standard fallback layers if initialization hasn't occurred yet
      if (!this.isInitialized) {
        this.ensureInitialized()
      }
      return false
    }
  }

  /**
   * Synchronously access the prepared data array
   */
  public static getDataset(): EmojiColorDataset {
    this.ensureInitialized()
    return this._dataset!
  }

  /**
   *  Convert an emoji into its color metadata properties synchronously
   */
  public static toColor(emoji: string): EmojiColorResult | null {
    this.ensureInitialized()
    const match = this._emojiMap!.get(emoji)
    if (!match) return null

    const [r, g, b, hex] = match.color
    return { unicodeInt: match.unicode, r, g, b, hex }
  }

  /**
   * Convert any RGB input into the absolute closest matching emoji synchronously
   */
  public static rgbToClosest(r: number, g: number, b: number): EmojiColorItem {
    this.ensureInitialized()
    let closestItem = this._dataset![0]
    let minDistance = Infinity

    for (const item of this._dataset!) {
      const [itemR, itemG, itemB] = item.color

      const dR = r - itemR
      const dG = g - itemG
      const dB = b - itemB
      const distance = dR * dR + dG * dG + dB * dB

      if (distance < minDistance) {
        minDistance = distance
        closestItem = item
      }
    }

    return closestItem
  }

  /**
   * Convert any Hex color string into the absolute closest matching emoji synchronously
   */
  public static hexToClosest(hex: string): EmojiColorItem | null {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return null
    return this.rgbToClosest(rgb[0], rgb[1], rgb[2])
  }

  private static hexToRgb(hexStr: string): [number, number, number] | null {
    const cleanHex = hexStr.replace(/^#/, "")
    if (cleanHex.length !== 3 && cleanHex.length !== 6) return null

    let hex = cleanHex
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("")
    }

    const num = parseInt(hex, 16)
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
  }
}

export * from "./types"
