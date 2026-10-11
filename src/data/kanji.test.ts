import { describe, expect, test } from "bun:test";
import kanji from "./kanji.json";

// A single displayed character must not ask for a whole word's reading.
// Readings checked against https://kanjiapi.dev/v1/kanji/{character}.
const verifiedReadings = [
	{ character: "音", reading: "oto" },
	{ character: "楽", reading: "raku" },
	{ character: "飯", reading: "meshi" },
	{ character: "菜", reading: "na" },
	{ character: "部", reading: "bu" },
	{ character: "店", reading: "mise" },
	{ character: "会", reading: "kai" },
	{ character: "小", reading: "shou" },
] as const;

describe("kanji practice data", () => {
	for (const { character, reading } of verifiedReadings) {
		test(`${character} uses a reading of the displayed character`, () => {
			expect(kanji.find((item) => item.kanji === character)?.romaji).toBe(reading);
		});
	}

	test("does not repeat a kanji prompt", () => {
		expect(new Set(kanji.map((item) => item.kanji)).size).toBe(kanji.length);
	});
});
