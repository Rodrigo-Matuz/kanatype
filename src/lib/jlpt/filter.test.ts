import { describe, expect, test } from "bun:test";
import { filterKanjiByLevel } from "./filter";

const entries = [
	{ kanji: "五", jlptLevel: 5 as const },
	{ kanji: "四", jlptLevel: 4 as const },
	{ kanji: "三", jlptLevel: 3 as const },
	{ kanji: "二", jlptLevel: 2 as const },
	{ kanji: "一", jlptLevel: 1 as const },
	{ kanji: "?", jlptLevel: null },
];

describe("filterKanjiByLevel", () => {
	test("through N3 includes N5, N4, and N3 but not harder or unclassified kanji", () => {
		expect(filterKanjiByLevel(entries, 3, "through").map((item) => item.kanji)).toEqual([
			"五",
			"四",
			"三",
		]);
	});
});
