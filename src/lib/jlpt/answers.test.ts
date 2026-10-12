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
	expect(isCorrectAnswer(" NICHI ", item, "pt-BR")).toBe(true);
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

test("grades meaning questions against Portuguese glosses when language is pt-BR", () => {
	const item = {
		type: "kanji",
		question: "meaning",
		kanji: "日",
		jlptLevel: 5,
		meanings: ["day", "sun"],
		onReadings: ["ニチ"],
		kunReadings: ["ひ", "-び", "-か"],
	} as const;
	expect(isCorrectAnswer("dia", item, "pt-BR")).toBe(true);
	expect(isCorrectAnswer("SOL", item, "pt-BR")).toBe(true);
	expect(isCorrectAnswer("day", item, "pt-BR")).toBe(false);
	expect(isCorrectAnswer("nichi", item, "pt-BR")).toBe(false);
});

test("untranslated kanji never accept English answers in Portuguese mode", () => {
	const missing = {
		type: "kanji",
		question: "meaning",
		kanji: "藤",
		jlptLevel: 1,
		meanings: ["wisteria"],
		onReadings: ["トウ"],
		kunReadings: ["ふじ"],
	} as const;
	expect(isCorrectAnswer("wisteria", missing, "pt-BR")).toBe(false);
});

test("Portuguese meaning grading accepts unaccented modern spellings without loosening romaji", () => {
	const country = {
		type: "kanji",
		question: "meaning",
		kanji: "国",
		jlptLevel: 5,
		meanings: ["country"],
		onReadings: ["コク"],
		kunReadings: ["くに"],
	} as const;
	const idea = {
		type: "kanji",
		question: "meaning",
		kanji: "見",
		jlptLevel: 5,
		meanings: ["see"],
		onReadings: ["ケン"],
		kunReadings: ["み"],
	} as const;
	expect(isCorrectAnswer("pais", country, "pt-BR")).toBe(true);
	expect(isCorrectAnswer("ideia", idea, "pt-BR")).toBe(true);
	expect(isCorrectAnswer("country", country, "pt-BR")).toBe(false);
	expect(
		isCorrectAnswer("fuji", { type: "hiragana", kana: "ふじ", romaji: "fuji" }, "pt-BR"),
	).toBe(true);
	expect(
		isCorrectAnswer("fúji", { type: "hiragana", kana: "ふじ", romaji: "fuji" }, "pt-BR"),
	).toBe(false);
});
