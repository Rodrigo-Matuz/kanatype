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
	kanji: string; // Kanji character (e.g. "猫")
	meaning: string; // English meaning of the kanji
}

// Any supported learning item in the application
export type JapaneseItem = KanaItem | KanjiItem;

// Methods exposed by Display component through React refs
export interface DisplayHandle {
	// Advances to the next learning item
	next: () => void;
}

// Props for Display component
export interface DisplayProps {
	// Fired whenever displayed item changes
	onChange?: (item: JapaneseItem) => void;
}