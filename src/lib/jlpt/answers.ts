import type { Language } from "@/i18n/translation";
import { getLocalizedMeanings } from "../../data/jlpt/meanings";
import type { JapaneseItem } from "../../types";
import { normalizeAnswer, normalizeMeaningAnswer } from "../practice";

export function isCorrectAnswer(
	answer: string,
	item: JapaneseItem,
	language: Language = "en",
): boolean {
	const normalized = normalizeAnswer(answer);
	if (!normalized) return false;
	if (item.type === "kanji" && item.question === "meaning") {
		const candidates = getLocalizedMeanings(item, language) ?? [];
		const normalizedMeaning = normalizeMeaningAnswer(answer);
		return candidates.some(
			(meaning) =>
				normalizeMeaningAnswer(meaning) === normalizedMeaning ||
				normalizeMeaningAnswer(meaning.replace(/\s+\([^()]+\)$/, "")) === normalizedMeaning,
		);
	}
	return normalized === normalizeAnswer(item.romaji);
}
