import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import data from "@/data/japanese.json";

/**
 * TablePage - Japanese Characters Reference
 *
 * This page displays all Hiragana, Katakana, and basic Kanji in a clean, searchable format.
 * It's designed to help Japanese learners quickly find characters, their readings (romaji),
 * and meanings.
 *
 * Main Features:
 * - Real-time search across kana, romaji, and meaning
 * - Auto-focused search bar for immediate typing
 * - Responsive grid (better on mobile and large screens)
 * - Clean, distraction-free design
 */

export default function TablePage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");

	// Ref to control the search input (used for auto-focus)
	const searchInputRef = useRef<HTMLInputElement>(null);

	const handleNavigateHome = () => {
		navigate("/");
	};

	// Auto-focus the search input when the page loads
	useEffect(() => {
		searchInputRef.current?.focus();
	}, []);

	// Normalize the search term (lowercase + trimmed) - done once for performance
	const query = useMemo(() => search.toLowerCase().trim(), [search]);

	// ====================== FILTERING LOGIC ======================

	// Filter Hiragana
	const filteredHiragana = useMemo(() => {
	return data.hiragana.filter((item) =>
		item.romaji.toLowerCase() === query ||
		item.romaji.toLowerCase().startsWith(query) ||
		item.romaji.toLowerCase().includes(query)
	);
	}, [query]);

	// Filter Katakana
	const filteredKatakana = useMemo(() => {
	return data.katakana.filter((item) =>
		item.romaji.toLowerCase() === query ||
		item.romaji.toLowerCase().startsWith(query) ||
		item.romaji.toLowerCase().includes(query)
	);
	}, [query]);

	// Filter Kanji + remove duplicates
	const filteredKanji = useMemo(() => {
		const filtered = data.kanji.filter((item) => {
			return (
				item.kana.toLowerCase().includes(query) ||
				item.romaji.toLowerCase().includes(query) ||
				item.meaning.toLowerCase().includes(query)
			);
		});

		// Deduplication: prevent showing the same kana/romaji combination multiple times
		const seen = new Map<string, boolean>();
		return filtered.filter((item) => {
			const key = `${item.kana}|${item.romaji}`;
			if (seen.has(key)) return false;
			seen.set(key, true);
			return true;
		});
	}, [query]);

	// ====================== RENDER ======================

	return (
		<div className="flex flex-col w-full h-screen">
			<Header
				activeScripts={[]}
				onToggle={() => {}}
				onSelectAll={() => {}}
				onNavigate={handleNavigateHome}
				currentView="table"
			/>

			{/* Centered Search Bar */}
			<div className="flex justify-center px-6 py-8">
				<input
					ref={searchInputRef}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search kana, romaji or meaning... (e.g. 'a', 'konnichi', 'love')"
					className="bg-background px-6 py-3.5 border border-border focus:border-primary rounded-2xl focus:outline-none w-full max-w-3xl placeholder:text-muted-foreground text-base"
					aria-label="Search Japanese characters"
				/>
			</div>

			<div className="flex-1 space-y-20 p-6 md:p-12 overflow-y-auto">
				{/* Hiragana Section */}
				{filteredHiragana.length > 0 && (
					<section>
						<SectionHeader title="Hiragana" />
						<div className="gap-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
							{filteredHiragana.map((item) => (
								<CharacterCard
									key={item.romaji}
									kana={item.kana}
									romaji={item.romaji}
								/>
							))}
						</div>
					</section>
				)}

				{/* Katakana Section */}
				{filteredKatakana.length > 0 && (
					<section>
						<SectionHeader title="Katakana" />
						<div className="gap-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
							{filteredKatakana.map((item) => (
								<CharacterCard
									key={item.romaji}
									kana={item.kana}
									romaji={item.romaji}
								/>
							))}
						</div>
					</section>
				)}

				{/* Kanji Section */}
				{filteredKanji.length > 0 && (
					<section>
						<SectionHeader title="Kanji" />
						<div className="gap-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
							{filteredKanji.map((item) => (
								<CharacterCard
									key={`${item.kana}-${item.romaji}`}
									kana={item.kana}
									romaji={item.romaji}
									meaning={item.meaning}
								/>
							))}
						</div>
					</section>
				)}

				{/* No Results Message */}
				{query &&
					filteredHiragana.length === 0 &&
					filteredKatakana.length === 0 &&
					filteredKanji.length === 0 && (
						<div className="py-20 text-center">
							<p className="text-muted-foreground text-2xl">
								No results found for <span className="font-medium">"{search}"</span>
							</p>
							<p className="mt-3 text-muted-foreground text-sm">
								Try different keywords or check your spelling.
							</p>
						</div>
					)}
			</div>
		</div>
	);
}

/* ====================== HELPER COMPONENTS ====================== */

/**
 * SectionHeader - Displays a big title with a decorative line
 */
function SectionHeader({ title }: { title: string }) {
	return (
		<div className="flex items-center gap-10 mb-8">
			<h1 className="font-bold text-4xl tracking-tight">{title}</h1>
			<div className="flex-1 bg-border h-px" />
		</div>
	);
}

/**
 * CharacterCard - Displays a single Japanese character
 *
 * Props:
 * - kana: The Japanese character (hiragana, katakana, or kanji)
 * - romaji: The English reading (e.g. "a", "ka", "ai")
 * - meaning: (Optional) English meaning for Kanji
 */
function CharacterCard({
	kana,
	romaji,
	meaning,
}: {
	kana: string;
	romaji: string;
	meaning?: string;
}) {
	return (
		<div className="p-8 rounded-3xl text-center hover:scale-105 active:scale-95 transition-all">
			{/* Main Character */}
			<div className="mb-4 text-6xl leading-none">{kana}</div>

			{/* Romaji Reading */}
			<div className="font-medium text-foreground text-xl">{romaji}</div>

			{/* Meaning (only for Kanji) */}
			{meaning && (
				<div className="mt-3 text-muted-foreground text-sm leading-snug">{meaning}</div>
			)}
		</div>
	);
}
