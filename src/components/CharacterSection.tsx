import { CharacterCard } from "@/components/CharacterCard";
import { SectionHeader } from "@/components/SectionHeader";
import type { JapaneseItem } from "@/types";

type Props = {
	/** Section title (e.g. "Hiragana", "Katakana", "Kanji") */
	title: string;
	/** Array of items to display in this section */
	items: JapaneseItem[];
};

/**
 * CharacterSection
 *
 * Renders a grouped section of Japanese characters (Hiragana, Katakana, or Kanji).
 * Used on the TablePage to separate different character types.
 *
 * - Skips rendering if no items are provided
 * - Uses responsive grid layout
 * - Generates stable React keys for each card
 */
export function CharacterSection({ title, items }: Props) {
	if (items.length === 0) return null;

	return (
		<section>
			<SectionHeader title={title} />

			<div className="gap-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
				{items.map((item) => {
					// Generate stable unique keys to help React reconciliation
					const uniqueKey =
						item.type === "kanji"
							? `${item.type}-${item.kanji}`
							: `${item.type}-${item.kana}`;

					return <CharacterCard key={uniqueKey} item={item} />;
				})}
			</div>
		</section>
	);
}