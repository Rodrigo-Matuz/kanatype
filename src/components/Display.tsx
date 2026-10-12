import { useLanguage } from "@/i18n/LanguageProvider";
import type { JapaneseItem } from "@/types";

type Props = { item: JapaneseItem };

export default function Display({ item }: Props) {
	const { language, t } = useLanguage();
	const character = item.type === "kanji" ? item.kanji : item.kana;

	return (
		<div className="character-display">
			<span className="character-glyph" lang="ja">
				{character}
			</span>
			<p className="character-caption">
				{item.type === "kanji" && item.question === "meaning"
					? t(
							language === "pt-BR"
								? "display.meaningPromptPt"
								: "display.meaningPrompt",
							{
								level: item.jlptLevel,
							},
						)
					: t("display.readingPrompt")}
			</p>
		</div>
	);
}
