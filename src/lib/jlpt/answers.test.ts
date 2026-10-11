import { expect, test } from "bun:test";
import { isCorrectAnswer } from "./answers";

test("retains strict romaji checking for curated reading questions", () => {
	const item = {
		type: "kanji",
		question: "reading",
		kanji: "日",
		romaji: "nichi",
		meaning: "day",
	} as const;
	expect(isCorrectAnswer(" NICHI ", item)).toBe(true);
	expect(isCorrectAnswer("day", item)).toBe(false);
});

test("accepts documented English glosses but never dictionary readings for meaning questions", () => {
	const item = {
		type: "kanji",
		question: "meaning",
		kanji: "日",
		jlptLevel: 5,
		meanings: ["day", "sun"],
		onReadings: ["ニチ"],
		kunReadings: ["ひ"],
	} as const;
	expect(isCorrectAnswer(" SUN ", item)).toBe(true);
	expect(isCorrectAnswer("nichi", item)).toBe(false);
});

test("accepts the whole gloss or its base without a trailing parenthetical qualifier", () => {
	const item = {
		type: "kanji",
		question: "meaning",
		kanji: "秒",
		jlptLevel: 2,
		meanings: ["second (1/60 minute)"],
		onReadings: ["ビョウ"],
		kunReadings: [],
	} as const;
	expect(isCorrectAnswer("second (1/60 minute)", item)).toBe(true);
	expect(isCorrectAnswer(" SECOND ", item)).toBe(true);
	expect(isCorrectAnswer("sec", item)).toBe(false);
	expect(isCorrectAnswer("1/60 minute", item)).toBe(false);
});
