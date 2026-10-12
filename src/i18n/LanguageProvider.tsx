import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { type Language, resolveLanguage, type TranslationKey, translate } from "./translation";

type Values = Record<string, string | number>;
type LanguageContextValue = {
	language: Language;
	setLanguage: (language: Language) => void;
	t: (key: TranslationKey, values?: Values) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
	language: "en",
	setLanguage: () => {},
	t: (key, values) => translate("en", key, values),
});

function savedLanguage(): Language {
	try {
		return resolveLanguage(localStorage.getItem("kanatype-language"));
	} catch {
		return "en";
	}
}

export function LanguageProvider({
	children,
	initialLanguage,
}: {
	children: React.ReactNode;
	initialLanguage?: Language;
}) {
	const [language, setLanguage] = useState<Language>(() => initialLanguage ?? savedLanguage());
	const t = useCallback(
		(key: TranslationKey, values?: Values) => translate(language, key, values),
		[language],
	);

	useEffect(() => {
		document.documentElement.lang = language;
		try {
			localStorage.setItem("kanatype-language", language);
		} catch {
			/* Storage may be disabled. */
		}
	}, [language]);

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage(): LanguageContextValue {
	return useContext(LanguageContext);
}
