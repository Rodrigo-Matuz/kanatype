import { expect, test } from "bun:test";
import type { JLPTLevel } from "@/lib/jlpt/filter";
import { getPracticePool } from "./practice-pool";

test("excludes untranslated Portuguese meaning prompts only (independent kana and curated 140 unchanged)", () => {
	for (const language of ["en", "pt-BR"] as const) {
		const counts: Record<JLPTLevel, number> =
			language === "en"
				? { 5: 79, 4: 166, 3: 367, 2: 367, 1: 1232 }
				: { 5: 79, 4: 166, 3: 367, 2: 367, 1: 950 };
		let cumulative = 0;
		for (const level of [5, 4, 3, 2, 1] as const) {
			const exact = getPracticePool(
				["kanji"],
				{ mode: "meaning", level, scope: "exact" },
				language,
			);
			expect(exact).toHaveLength(counts[level]);
			cumulative += counts[level];
			expect(
				getPracticePool(["kanji"], { mode: "meaning", level, scope: "through" }, language),
			).toHaveLength(cumulative);
		}
	}
	expect(
		getPracticePool(
			["hiragana", "katakana", "kanji"],
			{ mode: "meaning", level: 5, scope: "exact" },
			"pt-BR",
		).filter((item) => item.type !== "kanji"),
	).toHaveLength(
		getPracticePool(
			["hiragana", "katakana"],
			{ mode: "meaning", level: 5, scope: "exact" },
			"pt-BR",
		).length,
	);
	expect(
		getPracticePool(["kanji"], { mode: "reading", level: 1, scope: "exact" }, "pt-BR"),
	).toHaveLength(140);
});
