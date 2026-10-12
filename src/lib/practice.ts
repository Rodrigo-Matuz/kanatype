import type { JapaneseItem } from "../types";

function sameCharacter(item: JapaneseItem, previous: JapaneseItem | null): boolean {
	if (!previous || item.type !== previous.type) return false;
	return item.type === "kanji"
		? item.kanji === (previous as typeof item).kanji
		: item.kana === (previous as typeof item).kana;
}

export function normalizeAnswer(answer: string): string {
	return answer.trim().toLowerCase();
}

// Dictionary glosses can contain accents or older Portuguese spellings (e.g. "idéia").
// Keep romaji checking strict; apply this only to meanings and meaning searches.
export function normalizeMeaningAnswer(answer: string): string {
	return normalizeAnswer(answer).normalize("NFD").replace(/\p{M}/gu, "");
}

export function pickNext(
	items: readonly JapaneseItem[],
	previous: JapaneseItem | null,
	random: () => number = Math.random,
): JapaneseItem {
	if (items.length === 0) {
		throw new Error("No characters are available for the selected scripts");
	}

	const candidates =
		items.length > 1 ? items.filter((item) => !sameCharacter(item, previous)) : items;
	const pool = candidates.length > 0 ? candidates : items;
	return pool[Math.floor(random() * pool.length)];
}
