import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, useLanguage } from "./LanguageProvider";

function Probe() {
	const { language, t } = useLanguage();
	return <p lang={language}>{t("practice.title")}</p>;
}

test("selected language reaches every view through the shared provider", () => {
	expect(
		renderToStaticMarkup(
			<LanguageProvider initialLanguage="pt-BR">
				<Probe />
			</LanguageProvider>,
		),
	).toContain('<p lang="pt-BR">Aprenda um caractere de cada vez.</p>');
});
