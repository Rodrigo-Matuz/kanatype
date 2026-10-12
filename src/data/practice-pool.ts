import { getDataByTypes } from "@/data";
import curriculum from "@/data/jlpt/curriculum.json";
import ptMeanings from "@/data/jlpt/pt-meanings.json";
import type { Language } from "@/i18n/translation";
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

/**
 * The Portuguese meanining pool only includes kanji that have a Portuguese
 * glossary entry. Kanji without translation stay accessible in the reference
 * but are excluded from Portuguese practice so the app never accepts English
 * answers in a Portuguese session.
 */
const translatedMeanings = (item: MeaningKanjiItem): boolean =>
	item.kanji in ptMeanings && ptMeanings[item.kanji as keyof typeof ptMeanings]?.length > 0;

export function getPracticePool(
	types: ScriptType[],
	selection: PracticeSelection,
	language: Language = "en",
): JapaneseItem[] {
	const kanaTypes = types.filter((type) => type !== "kanji");
	const pool = kanaTypes.length ? getDataByTypes(kanaTypes) : [];
	if (!types.includes("kanji")) return pool;
	if (selection.mode === "reading") return [...pool, ...getDataByTypes(["kanji"])];

	const eligible =
		language === "pt-BR" ? meaningQuestions.filter(translatedMeanings) : meaningQuestions;
	return [...pool, ...filterKanjiByLevel(eligible, selection.level, selection.scope)];
}

export const curriculumKanji = meaningQuestions;
