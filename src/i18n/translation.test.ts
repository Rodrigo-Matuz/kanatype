import { expect, test } from "bun:test";
import en from "./en.json";
import ptBR from "./pt-BR.json";
import { resolveLanguage, translate, validateCatalog } from "./translation";

test("Portuguese and English catalogs have the same translation keys", () => {
	expect(Object.keys(ptBR).sort()).toEqual(Object.keys(en).sort());
});

test("Portuguese interface strings and interpolated values come from the JSON catalog", () => {
	expect(translate("pt-BR", "practice.title")).toBe("Aprenda um caractere de cada vez.");
	expect(translate("pt-BR", "practice.coverage.exact", { level: 3 })).toBe("Somente N3");
	expect(translate("en", "practice.coverage.exact", { level: 3 })).toBe("N3 only");
});

test("invalid saved languages fall back to English", () => {
	expect(resolveLanguage("pt-BR")).toBe("pt-BR");
	expect(resolveLanguage("pt-PT")).toBe("en");
	expect(resolveLanguage(null)).toBe("en");
});

test("translation validation rejects missing keys and mismatched placeholders", () => {
	expect(() => validateCatalog({ "practice.count": "{count} items" }, {})).toThrow(
		"Missing translation keys",
	);
	expect(() =>
		validateCatalog(
			{ "practice.count": "{count} items" },
			{ "practice.count": "{total} itens" },
		),
	).toThrow("Placeholder mismatch");
	expect(() => validateCatalog({ PracticeCount: "items" }, { PracticeCount: "itens" })).toThrow(
		"dot-separated",
	);
});
