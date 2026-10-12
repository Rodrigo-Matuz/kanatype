import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { CharacterCard } from "@/components/CharacterCard";
import { curriculumKanji } from "@/data/practice-pool";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { JapaneseItem } from "@/types";
import TablePage, { filterReferenceItems } from "./Table";

const person: JapaneseItem = {
	type: "kanji",
	question: "meaning",
	kanji: "人",
	jlptLevel: 5,
	meanings: ["person", "human"],
	onReadings: ["ジン"],
	kunReadings: ["ひと"],
};

function renderReference(language: "en" | "pt-BR") {
	const html = renderToStaticMarkup(
		<MemoryRouter>
			<LanguageProvider initialLanguage={language}>
				<TablePage />
			</LanguageProvider>
		</MemoryRouter>,
	);
	return html.slice(html.indexOf('<main class="reference-main">'));
}

function renderCard(item: JapaneseItem, language: "en" | "pt-BR") {
	return renderToStaticMarkup(
		<LanguageProvider initialLanguage={language}>
			<CharacterCard item={item} />
		</LanguageProvider>,
	);
}

test("Portuguese reference localizes visible copy, search accessibility, and preserves all source licenses and links", () => {
	const html = renderReference("pt-BR");
	expect(html).toContain("A BIBLIOTECA / 02 · TODOS OS NÍVEIS");
	expect(html).toContain("Referência de caracteres.");
	expect(html).toContain("independentemente dos filtros de prática");
	expect(html).toMatch(/\d+ caracteres/);
	expect(html).toContain(
		"Buscar kana ou kanji, leituras japonesas de dicionário (não romaji de kanji)",
	);
	expect(html).toContain(
		'placeholder="Busque kanji, leituras japonesas, significados, níveis N…"',
	);
	expect(html).toContain("Mostrar mais");
	expect(html).toContain("Sobre estes conjuntos de estudo e fontes dos dados");
	expect(html).toContain("2.211 kanji");
	expect(html).toContain("James William Breen, EDRDG e seus colaboradores");
	expect(html).toContain("CC BY-SA 4.0");
	expect(html).toContain("Tanos compartilha suas listas sob CC BY (versão não especificada)");
	expect(html).toContain("KanjiAPI compilou a correspondência de níveis");
	for (const url of [
		"https://www.edrdg.org/wiki/KANJIDIC_Project.html",
		"https://creativecommons.org/licenses/by-sa/4.0/",
		"https://www.edrdg.org/edrdg/licence.html",
		"https://www.tanos.co.uk/jlpt/",
		"https://github.com/onlyskin/kanjiapi.dev",
		"https://github.com/Rodrigo-Matuz/kanatype/blob/main/docs/DATA_SOURCES.md",
	])
		expect(html).toContain(`href="${url}"`);
	expect(html).not.toContain("THE LIBRARY / 02");
});

test("Portuguese reference cards show translated glosses and no English fallback", () => {
	const html = renderCard(person, "pt-BR");
	expect(html).toContain("N5 · pessoa");
	expect(html).toContain("ジン · ひと");
	expect(html).not.toContain("person");
	expect(html).not.toContain("human");
});

test("English reference card retains dictionary senses", () => {
	const html = renderCard(person, "en");
	expect(html).toContain("N5 · person, human");
});

test("Portuguese search indexes translated meanings, Japanese readings, glyphs and JLPT levels but not English glosses", () => {
	const day = curriculumKanji.find((item) => item.kanji === "日");
	if (!day) throw new Error("Missing 日 fixture");
	for (const query of ["pessoa", "ジン", "ひと", "人", "n5"]) {
		expect(filterReferenceItems([person], query, "pt-BR")).toEqual([person]);
	}
	expect(filterReferenceItems([day], "dia", "pt-BR")).toEqual([day]);
	expect(filterReferenceItems([day], "day", "pt-BR")).toEqual([]);
	expect(filterReferenceItems([day], "person", "pt-BR")).toEqual([]);
	expect(filterReferenceItems([day], "day", "en")).toEqual([day]);
	const idea = curriculumKanji.find((item) => item.kanji === "見");
	if (!idea) throw new Error("Missing 見 fixture");
	expect(filterReferenceItems([idea], "ideia", "pt-BR")).toEqual([idea]);
	expect(filterReferenceItems([idea], "see", "pt-BR")).toEqual([]);
	const untranslated = curriculumKanji.find((item) => item.kanji === "藤");
	if (!untranslated) throw new Error("Missing untranslated 藤 fixture");
	expect(filterReferenceItems([untranslated], "wisteria", "pt-BR")).toEqual([]);
	expect(filterReferenceItems([untranslated], "wisteria", "en")).toEqual([untranslated]);
	const curatedUntranslated: JapaneseItem = {
		type: "kanji",
		question: "reading",
		kanji: "藤",
		romaji: "fuji",
		meaning: "wisteria",
	};
	expect(filterReferenceItems([curatedUntranslated], "wisteria", "pt-BR")).toEqual([]);
	expect(filterReferenceItems([curatedUntranslated], "fuji", "en")).toEqual([
		curatedUntranslated,
	]);
	expect(filterReferenceItems([curatedUntranslated], "fuji", "pt-BR")).toEqual([
		curatedUntranslated,
	]);
	expect(
		filterReferenceItems([{ type: "hiragana", kana: "あ", romaji: "a" }], "あ", "pt-BR"),
	).toHaveLength(1);
});
