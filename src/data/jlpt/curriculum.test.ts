import { expect, test } from "bun:test";
import curriculum from "./curriculum.json";

test("bundled curriculum covers exactly the pinned disjoint N5–N1 source sets", () => {
	const counts = Object.fromEntries(
		[5, 4, 3, 2, 1].map((level) => [
			level,
			curriculum.filter((item) => item.jlptLevel === level).length,
		]),
	);
	expect(counts).toEqual({ 5: 79, 4: 166, 3: 367, 2: 367, 1: 1232 });
	expect(new Set(curriculum.map((item) => item.kanji)).size).toBe(curriculum.length);
	expect(
		curriculum.every(
			(item) =>
				item.meanings.length > 0 &&
				(item.onReadings.length > 0 || item.kunReadings.length > 0),
		),
	).toBe(true);
});
