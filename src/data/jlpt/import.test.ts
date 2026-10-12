import { expect, test } from "bun:test";
import { buildCurriculum, buildPortugueseMeanings, parseJLPTLevels } from "./import";

test("reads disjoint N5–N1 TSV groups as one level per character", () => {
	const levels = parseJLPTLevels("5\t学日\n4\t新\n3\t働\n2\t菜\n1\t憂\n");
	expect([...levels.entries()]).toEqual([
		["学", 5],
		["日", 5],
		["新", 4],
		["働", 3],
		["菜", 2],
		["憂", 1],
	]);
});

test("joins kanji by glyph, retaining English meanings and Japanese readings only", () => {
	const xml = `<kanjidic2><header><database_version>2026-284</database_version></header>
		<character><literal>学</literal><misc><jlpt>4</jlpt></misc><reading_meaning><rmgroup>
		<reading r_type="ja_on">ガク</reading><reading r_type="ja_kun">まな.ぶ</reading>
		<reading r_type="pinyin">xue2</reading><meaning>study</meaning>
		<meaning>learning</meaning><meaning m_lang="fr">étude</meaning>
		</rmgroup></reading_meaning></character></kanjidic2>`;
	expect(buildCurriculum(xml, parseJLPTLevels("5\t学\n"))).toEqual([
		{
			kanji: "学",
			jlptLevel: 5,
			meanings: ["study", "learning"],
			onReadings: ["ガク"],
			kunReadings: ["まな.ぶ"],
		},
	]);
});

test("extracts only m_lang=pt glosses keyed by glyph, preserving group order and omitting absent glosses", () => {
	const xml = `<kanjidic2>
		<character><literal>日</literal><reading_meaning><rmgroup>
		<meaning>day</meaning><meaning m_lang="pt">dia</meaning><meaning m_lang="fr">jour</meaning>
		</rmgroup><rmgroup><meaning m_lang="pt">sol</meaning></rmgroup></reading_meaning></character>
		<character><literal>人</literal><reading_meaning><rmgroup>
		<meaning>person</meaning><meaning m_lang="pt">pessoa</meaning>
		</rmgroup></reading_meaning></character>
		<character><literal>憂</literal><reading_meaning><rmgroup><meaning>melancholy</meaning>
		</rmgroup></reading_meaning></character>
	</kanjidic2>`;
	expect(buildPortugueseMeanings(xml, parseJLPTLevels("5	日人\n1	憂\n"))).toEqual({
		日: ["dia", "sol"],
		人: ["pessoa"],
	});
});
