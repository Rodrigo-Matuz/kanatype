import hiragana from "@/data/hiragana.json";
import kanji from "@/data/kanji.json";
import katakana from "@/data/katakana.json";
import type { JapaneseItem, ScriptType } from "@/types";

export const getDataByTypes = (types: ScriptType[]): JapaneseItem[] => {
	if (types.length === 0) types = ["hiragana"];

	const result: JapaneseItem[] = [];

	if (types.includes("hiragana")) {
		result.push(
			...hiragana.map(item => ({
				...item,
				type: "hiragana" as const,
			}))
		);
	}

	if (types.includes("katakana")) {
		result.push(
			...katakana.map(item => ({
				...item,
				type: "katakana" as const
			}))
		)
	}

	if (types.includes("kanji")) {
		result.push(
			...kanji.map(item => ({
				...item, 
				type: "kanji" as const
			}))
		)
	}

	return result;
};
