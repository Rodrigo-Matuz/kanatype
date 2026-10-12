import { getLocalizedMeanings } from "@/data/jlpt/meanings";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { JapaneseItem } from "@/types";

export function CharacterCard({ item }: { item: JapaneseItem }) {
	const { language, t } = useLanguage();
	const character = item.type === "kanji" ? item.kanji : item.kana;
	const meanings = getLocalizedMeanings(item, language);

	return (
		<div className="border border-border bg-card p-4 text-center transition-colors hover:border-primary">
			<div className="mb-3 text-5xl leading-none" lang="ja">
				{character}
			</div>

			<div className="font-medium text-foreground text-sm">
				{item.type === "kanji" && item.question === "meaning"
					? [...item.onReadings, ...item.kunReadings].join(" · ")
					: item.romaji}
			</div>

			{item.type === "kanji" && (
				<div className="mt-2 text-muted-foreground text-xs leading-snug">
					{item.question === "meaning"
						? `N${item.jlptLevel} · ${meanings?.join(", ") ?? t("reference.meaningMissing")}`
						: (meanings?.join(", ") ?? t("reference.meaningMissing"))}
				</div>
			)}
		</div>
	);
}
