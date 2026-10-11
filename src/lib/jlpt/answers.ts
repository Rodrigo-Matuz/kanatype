import type { JapaneseItem } from "../../types";
import { normalizeAnswer } from "../practice";

export function isCorrectAnswer(answer: string, item: JapaneseItem): boolean {
	const normalized = normalizeAnswer(answer);
	if (!normalized) return false;
	if (item.type === "kanji" && item.question === "meaning") {
		return item.meanings.some(
			(meaning) =>
				normalizeAnswer(meaning) === normalized ||
				normalizeAnswer(meaning.replace(/\s+\([^()]+\)$/, "")) === normalized,
		);
	}
	return normalized === normalizeAnswer(item.romaji);
}
