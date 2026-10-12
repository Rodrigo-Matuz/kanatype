import type { Language } from "@/i18n/translation";
import type { JapaneseItem } from "@/types";
import ptMeanings from "./pt-meanings.json";

export function getLocalizedMeanings(
	item: JapaneseItem,
	language: Language,
): readonly string[] | null {
	if (language === "pt-BR") {
		if (item.type !== "kanji") return null;
		const glyph = item.kanji as keyof typeof ptMeanings;
		const glosses = ptMeanings[glyph];
		return glosses?.length ? glosses : null;
	}
	if (item.type === "kanji" && item.question === "meaning") return item.meanings;
	const meaning = (item as { meaning?: string }).meaning;
	return meaning ? [meaning] : null;
}
