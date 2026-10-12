import { XMLParser } from "fast-xml-parser";
import type { JLPTLevel } from "../../lib/jlpt/filter";

export interface CurriculumKanji {
	kanji: string;
	jlptLevel: JLPTLevel;
	meanings: string[];
	onReadings: string[];
	kunReadings: string[];
}

type Reading = { "#text": string; "@_r_type": string };
type Meaning = string | { "#text": string; "@_m_lang": string };
type Character = {
	literal: string;
	reading_meaning?: { rmgroup: { reading?: Reading[]; meaning?: Meaning[] }[] };
};

function parseCharacters(xml: string): Map<string, Character> {
	const parser = new XMLParser({
		ignoreAttributes: false,
		parseTagValue: false,
		isArray: (tag: string) => ["character", "rmgroup", "reading", "meaning"].includes(tag),
	});
	const document = parser.parse(xml) as { kanjidic2?: { character?: Character[] } };
	return new Map((document.kanjidic2?.character ?? []).map((entry) => [entry.literal, entry]));
}

export function buildPortugueseMeanings(
	xml: string,
	levels: Map<string, JLPTLevel>,
): Record<string, string[]> {
	const characters = parseCharacters(xml);
	const result: Record<string, string[]> = {};
	for (const kanji of levels.keys()) {
		const character = characters.get(kanji);
		if (!character) throw new Error(`Missing dictionary entry for ${kanji}`);
		const meanings = (character.reading_meaning?.rmgroup ?? []).flatMap((group) =>
			(group.meaning ?? []).flatMap((meaning) =>
				typeof meaning !== "string" && meaning["@_m_lang"] === "pt"
					? [meaning["#text"]]
					: [],
			),
		);
		if (meanings.length) result[kanji] = meanings;
	}
	return result;
}

export function buildCurriculum(xml: string, levels: Map<string, JLPTLevel>): CurriculumKanji[] {
	const characters = parseCharacters(xml);
	return [...levels].map(([kanji, jlptLevel]) => {
		const character = characters.get(kanji);
		if (!character) throw new Error(`Missing dictionary entry for ${kanji}`);
		const groups = character.reading_meaning?.rmgroup ?? [];
		const meanings = groups.flatMap((group) =>
			(group.meaning ?? []).filter(
				(meaning): meaning is string => typeof meaning === "string",
			),
		);
		if (!meanings.length) throw new Error(`Missing English meaning for ${kanji}`);
		const readings = groups.flatMap((group) => group.reading ?? []);
		return {
			kanji,
			jlptLevel,
			meanings,
			onReadings: readings
				.filter((reading) => reading["@_r_type"] === "ja_on")
				.map((reading) => reading["#text"]),
			kunReadings: readings
				.filter((reading) => reading["@_r_type"] === "ja_kun")
				.map((reading) => reading["#text"]),
		};
	});
}

export function parseJLPTLevels(tsv: string): Map<string, JLPTLevel> {
	const levels = new Map<string, JLPTLevel>();
	for (const line of tsv.trim().split(/\r?\n/)) {
		const [rawLevel, characters, ...extra] = line.split("\t");
		if (!/^[1-5]$/.test(rawLevel) || !characters || extra.length) {
			throw new Error(`Invalid JLPT row: ${line}`);
		}
		const level = Number(rawLevel) as JLPTLevel;
		for (const kanji of Array.from(characters)) {
			if (levels.has(kanji)) throw new Error(`Duplicate JLPT kanji: ${kanji}`);
			levels.set(kanji, level);
		}
	}
	return levels;
}
