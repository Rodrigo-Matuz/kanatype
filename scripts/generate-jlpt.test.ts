import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import curriculum from "../src/data/jlpt/curriculum.json";
import { buildPortugueseMeanings, parseJLPTLevels } from "../src/data/jlpt/import";
import ptMeanings from "../src/data/jlpt/pt-meanings.json";

const source = new URL("../data/sources/", import.meta.url);
const archive = readFileSync(new URL("kanjidic2.xml.gz", source));
const tsv = readFileSync(new URL("jlpt.tsv", source));
const sha256 = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

test("Portuguese extraction uses the verified bundled EDRDG and KanjiAPI snapshots", () => {
	expect(sha256(archive)).toBe(
		"91a70dff7bb2e4617027574e889c10bf96b907233d682baa4d9cf07e4c626157",
	);
	expect(sha256(tsv)).toBe("52ff4165bc3bac8d5784c8521c41a2255c0346a580d8f24ab0f259451564ccfe");
	const glosses = buildPortugueseMeanings(
		gunzipSync(archive).toString("utf8"),
		parseJLPTLevels(tsv.toString("utf8")),
	);
	const counts = Object.fromEntries(
		[5, 4, 3, 2, 1].map((level) => [
			level,
			curriculum.filter((item) => item.jlptLevel === level && glosses[item.kanji]?.length)
				.length,
		]),
	);
	expect(counts).toEqual({ 5: 79, 4: 166, 3: 367, 2: 367, 1: 950 });
	expect(Object.keys(glosses)).toHaveLength(1929);
	expect(glosses.日).toContain("dia");
	expect(glosses.人).toContain("pessoa");
});

test("checked-in Portuguese artifact matches pinned extraction without rewriting files", () => {
	const regenerated = buildPortugueseMeanings(
		gunzipSync(archive).toString("utf8"),
		parseJLPTLevels(tsv.toString("utf8")),
	);
	expect(regenerated).toEqual(ptMeanings);
});
