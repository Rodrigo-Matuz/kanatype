import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterSection } from "@/components/CharacterSection";
import Header from "@/components/Header";

import { getDataByTypes } from "@/data";

import type { KanaItem, KanjiItem } from "@/types";

/**
/**
 * TablePage
 *
 * Displays all Japanese characters (Hiragana, Katakana, and Kanji) with
 * real-time search filtering.
 *
 * Features:
 * - Live fuzzy search across kana, romaji, and meanings
 * - Auto-focus on search input
 * - Grouped sections by character type
 */
export default function TablePage() {
	const navigate = useNavigate();

	// Search state
	const [search, setSearch] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);
	const handleNavigateHome = () => navigate("/");

	// Auto-focus search input on mount
	useEffect(() => {
		searchInputRef.current?.focus();
	}, []);

	/**
	 * Normalized search query
	 *
	 * Why useMemo?
	 *   Prevents recalculating every render unless `search` changes.
	 */
	const query = useMemo(() => {
		return search.toLowerCase().trim();
	}, [search]);

	/**
	 * 	Load all character data (static)
	 *
	 * This grabs ALL supported data types from the data layer.
	 */
	const allItems = useMemo(() => {
		return getDataByTypes(["hiragana", "katakana", "kanji"]);
	}, []);

	/**
	 * Filter items based on search query
	 *
	 * Search behavior:
	 * - Kana: matches kana symbol or romaji
	 * - Kanji: matches kanji, romaji, or english meaning
	 *
	 * Romaji matching is intentionally fuzzy:
	 * - `includes()` + `startsWith()` allows partial matches
	 *   (e.g. "ky" matches kya/kyo/kyu, "u" matches tsu/myu/etc.)
	 */
	const filteredItems = useMemo(() => {
		 // No search query? Return ALL items immediately.
		if (!query) {
			return allItems;
		}

		return allItems.filter((item) => {
			const romajiLower = item.romaji.toLowerCase();
			const queryLower = query;

			const matchesRomaji =
				romajiLower.includes(queryLower) || romajiLower.startsWith(queryLower);

			// Kana item
			if (item.type !== "kanji") {
				return item.kana.includes(query) || matchesRomaji;
			}

			// Kanji item
			return (
				item.kanji.includes(query) ||
				matchesRomaji ||
				item.meaning.toLowerCase().includes(queryLower)
			);
		});
	}, [allItems, query]);

	// Group items by type
	const hiraganaItems = useMemo(
		() => filteredItems.filter((item): item is KanaItem => item.type === "hiragana"),
		[filteredItems],
	);

	const katakanaItems = useMemo(
		() => filteredItems.filter((item): item is KanaItem => item.type === "katakana"),
		[filteredItems],
	);

	const kanjiItems = useMemo(
		() => filteredItems.filter((item): item is KanjiItem => item.type === "kanji"),
		[filteredItems],
	);

	return (
			<div className="flex flex-col w-full h-screen">
				<Header
					activeScripts={[]}
					onToggle={() => {}}
					onSelectAll={() => {}}
					onNavigate={handleNavigateHome}
					currentView="table"
				/>

				{/* Search Bar */}
				<div className="flex justify-center px-6 py-8">
					<input
						ref={searchInputRef}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search kana, romaji or meaning..."
						className="
							bg-background
							px-6
							py-3.5
							w-full
							max-w-3xl
							text-base
							border-b-5
							placeholder:text-muted-foreground
							focus:border-primary
							focus:outline-none
						"
					/>
				</div>

				{/* Main Content */}
				<div className="flex-1 space-y-20 p-6 md:p-12 overflow-y-auto">
					<CharacterSection title="Hiragana" items={hiraganaItems} />
					<CharacterSection title="Katakana" items={katakanaItems} />
					<CharacterSection title="Kanji" items={kanjiItems} />

					{query && filteredItems.length === 0 && (
						<div className="py-20 text-center">
							<p className="text-muted-foreground text-2xl">
								No results found for "{search}"
							</p>
						</div>
					)}
				</div>
			</div>
		);
}