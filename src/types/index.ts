/**
 * All supported Japanese script categories in the app
 */
export type ScriptType = "hiragana" | "katakana" | "kanji";

/**
 * Base fields shared by all learning items
 */
interface BaseJapaneseItem {
	/**
	 * Defines which script category this item belongs to
	 */
	type: ScriptType;

	/**
	 * Latin transcription / expected user answer
	 *
	 * Examples:
	 * - "a"
	 * - "shi"
	 * - "neko"
	 */
	romaji: string;
}

/**
 * Hiragana / Katakana item
 */
export interface KanaItem extends BaseJapaneseItem {
	type: "hiragana" | "katakana";

	/**
	 * Japanese kana character
	 *
	 * Examples:
	 * - あ
	 * - シ
	 */
	kana: string;
}

/**
 * Kanji item
 */
export interface KanjiItem extends BaseJapaneseItem {
	type: "kanji";

	/**
	 * Kanji character
	 *
	 * Example:
	 * - 猫
	 */
	kanji: string;

	/**
	 * English meaning of the kanji
	 */
	meaning: string;
}

/**
 * Any supported learning item in the application
 */
export type JapaneseItem = KanaItem | KanjiItem;

/**
 * Methods exposed by Display component through React refs
 */
export interface DisplayHandle {
	/**
	 * Advances to the next learning item
	 */
	next: () => void;
}

/**
 * Props for Display component
 */
export interface DisplayProps {
	/**
	 * Fired whenever displayed item changes
	 */
	onChange?: (item: JapaneseItem) => void;
}