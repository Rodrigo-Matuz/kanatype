import type { JapaneseItem } from "@/types";

export function CharacterCard({ item }: { item: JapaneseItem }) {
	const character = item.type === "kanji" ? item.kanji : item.kana;

	return (
		<div className="border border-border bg-card p-4 text-center transition-colors hover:border-primary">
			<div className="mb-3 text-5xl leading-none" lang="ja">
				{character}
			</div>

			<div className="font-medium text-foreground text-sm">{item.romaji}</div>

			{item.type === "kanji" && (
				<div className="mt-2 text-muted-foreground text-xs leading-snug">
					{item.meaning}
				</div>
			)}
		</div>
	);
}
