"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiColor = void 0;
class EmojiColor {
    static REMOTE_URL = "https://raw.githubusercontent.com/user-lezi/emoji-color/refs/heads/main/emojis.json";
    static FALLBACK_DATASET = [
        { emoji: "🥑", unicode: 129361, color: [118, 179, 67, "#76b343"] },
        { emoji: "🔴", unicode: 128308, color: [190, 25, 49, "#be1931"] },
        { emoji: "🍉", unicode: 127817, color: [234, 89, 110, "#ea596e"] },
        { emoji: "🐳", unicode: 128051, color: [56, 189, 248, "#38bdf8"] },
        { emoji: "🖤", unicode: 128420, color: [30, 41, 59, "#1e293b"] },
    ];
    static _dataset = null;
    static _emojiMap = null;
    static isInitialized = false;
    constructor() {
        throw new Error("EmojiColor is a static utility class and cannot be instantiated.");
    }
    static ensureInitialized() {
        if (this.isInitialized)
            return;
        try {
            const localData = require("../emojis.json");
            this._dataset = (localData.default || localData);
        }
        catch (error) {
            this._dataset = [...this.FALLBACK_DATASET];
        }
        this.rebuildInternalMaps();
        this.isInitialized = true;
    }
    static rebuildInternalMaps() {
        if (this._dataset) {
            this._emojiMap = new Map(this._dataset.map((item) => [item.emoji, item]));
        }
    }
    static async fetch() {
        try {
            const response = await fetch(this.REMOTE_URL);
            if (!response.ok)
                throw new Error(`HTTP status error: ${response.status}`);
            const remoteData = (await response.json());
            if (Array.isArray(remoteData) && remoteData.length > 0) {
                this._dataset = remoteData;
                this.rebuildInternalMaps();
                this.isInitialized = true;
                return true;
            }
            return false;
        }
        catch (err) {
            console.error("EmojiColor: Manual .fetch() pipeline failed.", err);
            if (!this.isInitialized) {
                this.ensureInitialized();
            }
            return false;
        }
    }
    static getDataset() {
        this.ensureInitialized();
        return this._dataset;
    }
    static toColor(emoji) {
        this.ensureInitialized();
        const match = this._emojiMap.get(emoji);
        if (!match)
            return null;
        const [r, g, b, hex] = match.color;
        return { unicodeInt: match.unicode, r, g, b, hex };
    }
    static rgbToClosest(r, g, b) {
        this.ensureInitialized();
        let closestItem = this._dataset[0];
        let minDistance = Infinity;
        for (const item of this._dataset) {
            const [itemR, itemG, itemB] = item.color;
            const dR = r - itemR;
            const dG = g - itemG;
            const dB = b - itemB;
            const distance = dR * dR + dG * dG + dB * dB;
            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        }
        return closestItem;
    }
    static hexToClosest(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb)
            return null;
        return this.rgbToClosest(rgb[0], rgb[1], rgb[2]);
    }
    static hexToRgb(hexStr) {
        const cleanHex = hexStr.replace(/^#/, "");
        if (cleanHex.length !== 3 && cleanHex.length !== 6)
            return null;
        let hex = cleanHex;
        if (hex.length === 3) {
            hex = hex
                .split("")
                .map((char) => char + char)
                .join("");
        }
        const num = parseInt(hex, 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }
}
exports.EmojiColor = EmojiColor;
__exportStar(require("./types"), exports);
