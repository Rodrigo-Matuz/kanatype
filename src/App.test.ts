import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

function render(path: string) {
	return renderToStaticMarkup(
		createElement(MemoryRouter, { initialEntries: [path] }, createElement(App)),
	);
}

test("practice starts with kana reading, without hiding the script selector", () => {
	const html = render("/");
	expect(html).toContain("ROMAJI");
	expect(html).toContain("KanataType");
	expect(html).toContain("Kanji");
});

test("reference includes the entire JLPT-aligned library and in-app attribution", () => {
	const html = render("/table");
	expect(html).toContain("ALL LEVELS");
	expect(html).toContain("Showing 120 of ");
	expect(html).toContain("Japanese dictionary readings (not kanji romaji)");
	expect(html).toContain("Japanese dictionary readings, meanings, N-levels");
	expect(html).toContain("EDRDG KANJIDIC2");
	expect(html).toContain("James William Breen");
	expect(html).toContain("EDRDG contributors");
	expect(html).toContain("CC BY-SA 4.0");
	expect(html).toContain("extract");
	expect(html).toContain("join");
	expect(html).toContain("filter");
	expect(html).toContain("Tanos JLPT resources");
	expect(html).toContain("CC BY (version unspecified)");
	expect(html).toContain("KanjiAPI");
	expect(html).toContain("JLPT-aligned study sets are not official exam requirements");
});
