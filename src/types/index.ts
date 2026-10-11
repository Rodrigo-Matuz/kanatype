// All supported Japanese script categories in the app
export type ScriptType = "hiragana" | "katakana" | "kanji";

// Base fields shared by all learning items
interface BaseJapaneseItem {
	romaji: string; // Latin transcription / expected user answer (e.g. "a", "shi", "neko")
}

// Hiragana / Katakana item
export interface KanaItem extends BaseJapaneseItem {
	type: "hiragana" | "katakana";
	kana: string; // Japanese kana character (e.g. "あ", "シ")
}

// Kanji item
export interface KanjiItem extends BaseJapaneseItem {
	type: "kanji";
	question: "reading";
	kanji: string; // Kanji character (e.g. "猫")
	meaning: string; // English meaning of the kanji
}

export interface MeaningKanjiItem {
	type: "kanji";
	question: "meaning";
	kanji: string;
	jlptLevel: import("@/lib/jlpt/filter").JLPTLevel;
	meanings: readonly string[];
	onReadings: readonly string[];
	kunReadings: readonly string[];
}

// Any supported learning item in the application
export type JapaneseItem = KanaItem | KanjiItem | MeaningKanjiItem;
