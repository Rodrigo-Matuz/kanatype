import en from "./en.json";
import ptBR from "./pt-BR.json";

export type Language = "en" | "pt-BR";
export type TranslationKey = keyof typeof en;

const catalogs: Record<Language, Record<TranslationKey, string>> = {
	en,
	"pt-BR": ptBR,
};

export function validateCatalog(source: Record<string, string>, target: Record<string, string>) {
	const sourceKeys = Object.keys(source);
	if (sourceKeys.some((key) => !/^[a-z][\w-]*(?:\.[a-z][\w-]*)+$/.test(key))) {
		throw new Error("Translation keys must be dot-separated and begin with a letter");
	}
	const missing = sourceKeys.filter((key) => !(key in target));
	const extra = Object.keys(target).filter((key) => !(key in source));
	if (missing.length || extra.length) {
		throw new Error(
			`Missing translation keys: ${missing.join(", ")}; extra keys: ${extra.join(", ")}`,
		);
	}
	const placeholders = (value: string) =>
		[...new Set([...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]))].sort().join(",");
	for (const key of sourceKeys) {
		if (placeholders(source[key]) !== placeholders(target[key])) {
			throw new Error(`Placeholder mismatch in ${key}`);
		}
	}
}

export function resolveLanguage(value: unknown): Language {
	return value === "pt-BR" ? "pt-BR" : "en";
}

export function translate(
	language: Language,
	key: TranslationKey,
	values: Record<string, string | number> = {},
): string {
	return catalogs[language][key].replace(/\{(\w+)\}/g, (match, name: string) =>
		values[name] === undefined ? match : String(values[name]),
	);
}
