import { getDataByTypes } from "@/data";
import curriculum from "@/data/jlpt/curriculum.json";
import { filterKanjiByLevel, type JLPTLevel, type JLPTScope } from "@/lib/jlpt/filter";
import type { JapaneseItem, MeaningKanjiItem, ScriptType } from "@/types";

export type KanjiMode = "reading" | "meaning";
export type PracticeSelection = { mode: KanjiMode; level: JLPTLevel; scope: JLPTScope };

// The dictionary supplies meanings for recognition prompts, NOT context-free romaji readings.
// Curated reading prompts remain available in their original mode.
const meaningQuestions: MeaningKanjiItem[] = curriculum.map((item) => ({
	...item,
	type: "kanji",
	question: "meaning",
	jlptLevel: item.jlptLevel as JLPTLevel,
}));

export function getPracticePool(types: ScriptType[], selection: PracticeSelection): JapaneseItem[] {
	const kanaTypes = types.filter((type) => type !== "kanji");
	const pool = kanaTypes.length ? getDataByTypes(kanaTypes) : [];
	if (!types.includes("kanji")) return pool;
	if (selection.mode === "reading") return [...pool, ...getDataByTypes(["kanji"])];
	return [...pool, ...filterKanjiByLevel(meaningQuestions, selection.level, selection.scope)];
}

export const curriculumKanji = meaningQuestions;
