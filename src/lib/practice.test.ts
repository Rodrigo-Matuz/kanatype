import { describe, expect, test } from "bun:test";
import type { JapaneseItem } from "../types";
import { normalizeAnswer, pickNext } from "./practice";

const items: JapaneseItem[] = [
	{ type: "hiragana", kana: "あ", romaji: "a" },
	{ type: "hiragana", kana: "い", romaji: "i" },
	{ type: "katakana", kana: "ウ", romaji: "u" },
];

describe("pickNext", () => {
	test("chooses an item from the available pool", () => {
		expect(pickNext(items, null, () => 0)).toEqual(items[0]);
	});

	test("does not repeat the current item when another exists", () => {
		expect(pickNext(items, items[0], () => 0)).toEqual(items[1]);
		expect(pickNext(items, items[2], () => 0.99)).toEqual(items[1]);
	});

	test("does not repeat a character when the pool is freshly mapped", () => {
		const copied = items.map((item) => ({ ...item }));
		expect(pickNext(copied, items[0], () => 0)).toEqual(items[1]);
	});

	test("works with a single item", () => {
		expect(pickNext([items[0]], items[0], () => 0)).toEqual(items[0]);
	});
});

test("answers ignore surrounding whitespace and case, but not wrong spelling", () => {
	expect(normalizeAnswer("  SHI  ")).toBe("shi");
	expect(normalizeAnswer("si")).not.toBe(normalizeAnswer("shi"));
});
