import type { JapaneseItem } from "@/types";

export function CharacterCard({ item }: { item: JapaneseItem }) {
	const character = item.type === "kanji" ? item.kanji : item.kana;

	return (
		<div className="p-8 rounded-3xl text-center hover:scale-105 active:scale-95 transition-all">
			<div className="mb-4 text-6xl leading-none">{character}</div>

			<div className="font-medium text-foreground text-xl">{item.romaji}</div>

			{item.type === "kanji" && (
				<div className="mt-3 text-muted-foreground text-sm leading-snug">
					{item.meaning}
				</div>
			)}
		</div>
	);
}