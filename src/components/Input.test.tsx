import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { curriculumKanji } from "@/data/practice-pool";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import Display from "./Display";
import Input from "./Input";

const person = curriculumKanji.find((item) => item.kanji === "人");
if (!person) throw new Error("Missing 人 from the test curriculum");

test("Portuguese meaning prompt and answer affordances request a Portuguese gloss", () => {
	const html = renderToStaticMarkup(
		<LanguageProvider initialLanguage="pt-BR">
			<Display item={person} />
			<Input currentItem={person} onCorrect={() => {}} onWrong={() => {}} onSkip={() => {}} />
		</LanguageProvider>,
	);
	expect(html).toContain("Digite um significado em português.");
	expect(html).toContain("SIGNIFICADO EM PORTUGUÊS");
	expect(html).toContain("Conferir");
	expect(html).not.toContain("ENGLISH MEANING");
});

test("English prompts remain in English and romaji practice remains phonetic", () => {
	const html = renderToStaticMarkup(
		<LanguageProvider initialLanguage="en">
			<Display item={person} />
			<Input currentItem={person} onCorrect={() => {}} onWrong={() => {}} onSkip={() => {}} />
		</LanguageProvider>,
	);
	expect(html).toContain("English dictionary gloss");
	expect(html).toContain("ENGLISH MEANING");
});
