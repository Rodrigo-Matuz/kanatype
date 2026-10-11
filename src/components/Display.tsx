import type { JapaneseItem } from "@/types";

type Props = { item: JapaneseItem };

export default function Display({ item }: Props) {
	const character = item.type === "kanji" ? item.kanji : item.kana;

	return (
		<div className="character-display">
			<span className="character-glyph" lang="ja">
				{character}
			</span>
			<p className="character-caption">
				{item.type === "kanji" && item.question === "meaning"
					? `What does this N${item.jlptLevel} character mean? Type an English dictionary gloss.`
					: "What does this character sound like?"}
			</p>
		</div>
	);
}
