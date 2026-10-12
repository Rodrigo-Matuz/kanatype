import { expect, test } from "bun:test";
import type { JLPTLevel } from "@/lib/jlpt/filter";
import curriculum from "./curriculum.json";
import { getLocalizedMeanings } from "./meanings";
import ptMeanings from "./pt-meanings.json";

const day = curriculum.find((item) => item.kanji === "日");
if (!day) throw new Error("Missing 日 fixture");
const missing = curriculum.find((item) => item.jlptLevel === 1 && !(item.kanji in ptMeanings));
if (!missing) throw new Error("Missing untranslated N1 fixture");

test("returns English meanings from the original item and Portuguese meanings by glyph", () => {
	const item = {
		...day,
		type: "kanji",
		question: "meaning",
		jlptLevel: day.jlptLevel as JLPTLevel,
	} as const;
	expect(getLocalizedMeanings(item, "en")).toEqual(day.meanings);
	expect(getLocalizedMeanings(item, "pt-BR")).toEqual(ptMeanings.日);
	expect(getLocalizedMeanings(item, "pt-BR")).toContain("dia");
});

test("looks up curated kanji by glyph, never reuses their English meaning as Portuguese", () => {
	const curated = {
		type: "kanji",
		question: "reading",
		kanji: "人",
		romaji: "hito",
		meaning: "person",
	} as const;
	expect(getLocalizedMeanings(curated, "en")).toEqual(["person"]);
	expect(getLocalizedMeanings(curated, "pt-BR")).toContain("pessoa");
});

test("missing Portuguese glyph returns null even when English meanings exist", () => {
	const item = {
		...missing,
		type: "kanji",
		question: "meaning",
		jlptLevel: missing.jlptLevel as JLPTLevel,
	} as const;
	expect(getLocalizedMeanings(item, "pt-BR")).toBeNull();
	expect(getLocalizedMeanings(item, "en")).toEqual(missing.meanings);
});
