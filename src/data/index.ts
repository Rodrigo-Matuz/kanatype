import japaneseData from "@/data/japanese.json";
import type { ScriptType } from "@/types/dataTypes";
import type { JapaneseItem } from "@/types/displayTypes";

/**
 * Returns a combined dataset based on selected script types.
 *
 * Behavior:
 * - If no types are provided → defaults to hiragana only
 * - If multiple types are provided → merges all matching datasets
 *
 * Example:
 * getDataByTypes(["hiragana", "kanji"])
 */
export const getDataByTypes = (types: ScriptType[]): JapaneseItem[] => {
	/**
	 * Safety fallback:
	 * If user somehow has no selection, we default to hiragana
	 * so the app always has usable content.
	 */
	if (types.length === 0) {
		return japaneseData.hiragana;
	}

	const result: JapaneseItem[] = [];

	/**
	 * Merge datasets based on selected filters
	 */
	if (types.includes("hiragana")) {
		result.push(...japaneseData.hiragana);
	}

	if (types.includes("katakana")) {
		result.push(...japaneseData.katakana);
	}

	if (types.includes("kanji")) {
		result.push(...japaneseData.kanji);
	}

	return result;
};
