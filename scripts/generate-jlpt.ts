import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { buildCurriculum, parseJLPTLevels } from "../src/data/jlpt/import";

const source = new URL("../data/sources/", import.meta.url);
const archive = await readFile(new URL("kanjidic2.xml.gz", source));
const levels = await readFile(new URL("jlpt.tsv", source));
const sha256 = (contents: Uint8Array) => createHash("sha256").update(contents).digest("hex");
if (sha256(archive) !== "91a70dff7bb2e4617027574e889c10bf96b907233d682baa4d9cf07e4c626157") {
	throw new Error("KANJIDIC2 source checksum changed; verify provenance before updating");
}
if (sha256(levels) !== "52ff4165bc3bac8d5784c8521c41a2255c0346a580d8f24ab0f259451564ccfe") {
	throw new Error("JLPT level source checksum changed; verify provenance before updating");
}
const curriculum = buildCurriculum(
	gunzipSync(archive).toString("utf8"),
	parseJLPTLevels(levels.toString("utf8")),
);
if (curriculum.length !== 2211)
	throw new Error(`Expected 2211 kanji; received ${curriculum.length}`);
const output = new URL("../src/data/jlpt/curriculum.json", import.meta.url);
await writeFile(output, `${JSON.stringify(curriculum, null, "\t")}\n`);
const formatted = spawnSync("bunx", ["@biomejs/biome", "format", "--write", output.pathname], {
	stdio: "inherit",
});
if (formatted.status !== 0) throw new Error("Failed to format generated curriculum");
console.log(
	`Generated ${curriculum.length} JLPT-aligned kanji entries from verified offline sources`,
);
