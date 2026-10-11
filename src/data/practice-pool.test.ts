import { expect, test } from "bun:test";
import type { JLPTLevel } from "@/lib/jlpt/filter";
import { getPracticePool } from "./practice-pool";

test("all five exact levels and every cumulative boundary match bundled coverage", () => {
	const counts: Record<JLPTLevel, number> = { 5: 79, 4: 166, 3: 367, 2: 367, 1: 1232 };
	let cumulative = 0;
	for (const level of [5, 4, 3, 2, 1] as const) {
		const exact = getPracticePool(["kanji"], { mode: "meaning", level, scope: "exact" });
		expect(exact).toHaveLength(counts[level]);
		expect(
			exact.every(
				(item) =>
					item.type === "kanji" &&
					item.question === "meaning" &&
					item.jlptLevel === level,
			),
		).toBe(true);
		cumulative += counts[level];
		expect(
			getPracticePool(["kanji"], { mode: "meaning", level, scope: "through" }),
		).toHaveLength(cumulative);
	}
});

test("keeps kana independent and filters all bundled kanji by introduction level", () => {
	const n5 = getPracticePool(["hiragana", "kanji"], {
		mode: "meaning",
		level: 5,
		scope: "exact",
	});
	expect(n5.filter((item) => item.type === "kanji")).toHaveLength(79);
	expect(n5.some((item) => item.type === "hiragana")).toBe(true);
	expect(
		getPracticePool(["kanji"], { mode: "meaning", level: 3, scope: "through" }),
	).toHaveLength(612);
	expect(getPracticePool(["kanji"], { mode: "meaning", level: 1, scope: "exact" })).toHaveLength(
		1232,
	);
});

test("retains curated romaji questions unless meaning mode is explicitly chosen", () => {
	const pool = getPracticePool(["kanji"], { mode: "reading", level: 1, scope: "exact" });
	expect(pool).toHaveLength(140);
	expect(pool.every((item) => item.type === "kanji" && item.question === "reading")).toBe(true);
});
