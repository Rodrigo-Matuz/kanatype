import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageProvider";
import type { Language } from "./i18n/translation";

function render(path: string, language: Language = "en") {
	return renderToStaticMarkup(
		<LanguageProvider initialLanguage={language}>
			<MemoryRouter initialEntries={[path]}>{<App />}</MemoryRouter>
		</LanguageProvider>,
	);
}

test("Portuguese practice renders translated shell and a visible language selector", () => {
	const html = render("/", "pt-BR");
	expect(html).toContain("Aprenda um caractere de cada vez.");
	expect(html).toContain("SEU ESPAÇO PARA PRATICAR JAPONÊS");
	expect(html).toContain("Navegação do aplicativo");
	expect(html).toContain("Progresso na prática");
	expect(html).toContain("Idioma");
	expect(html).toContain('value="pt-BR" selected=""');
	expect(html).toContain("Português (Brasil)");
	expect(html).toContain("カ");
	expect(html).toContain("KanataType");
});

test("English practice remains the default", () => {
	const html = render("/");
	expect(html).toContain("Learn one character at a time.");
	expect(html).toContain("YOUR JAPANESE PRACTICE SPACE");
	expect(html).toContain('value="en" selected=""');
});

test("Portuguese reference header also exposes the language selector", () => {
	const html = render("/table", "pt-BR");
	expect(html).toContain("REFERÊNCIA DE CARACTERES");
	expect(html).toContain("Praticar");
	expect(html).toContain("Idioma");
	expect(html).toContain('value="pt-BR" selected=""');
});

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
