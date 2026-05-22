import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import { getDataByTypes } from "@/data";
import type { JapaneseItem, KanaItem, KanjiItem } from "@/types";

export default function TablePage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);
	const handleNavigateHome = () => {
		navigate("/");
	};

	useEffect(() => {
		searchInputRef.current?.focus();
	}, []);

	const query = useMemo(() => search.toLowerCase().trim(), [search]);

	// ======================
	// LOAD ALL DATA
	// ======================

	const allItems = useMemo(() => getDataByTypes(["hiragana", "katakana", "kanji"]), []);

	// ======================
	// FILTERING
	// ======================

	const filteredItems = useMemo(() => {
		if (!query) return allItems;

		return allItems.filter((item) => {
			// Change .includes() to .startsWith() for cleaner romaji matching
			const matchesRomaji = item.romaji.toLowerCase().startsWith(query);

			// Kana items
			if (item.type !== "kanji") {
				return item.kana.includes(query) || matchesRomaji;
			}

			// Kanji items
			return (
				item.kanji.includes(query) ||
				matchesRomaji ||
				item.meaning.toLowerCase().includes(query)
			);
		});
	}, [allItems, query]);

	// ======================
	// GROUP BY TYPE
	// ======================

	const hiraganaItems = filteredItems.filter(
		(item): item is KanaItem => item.type === "hiragana",
	);

	const katakanaItems = filteredItems.filter(
		(item): item is KanaItem => item.type === "katakana",
	);

	const kanjiItems = filteredItems.filter((item): item is KanjiItem => item.type === "kanji");

	// ======================
	// RENDER
	// ======================

	return (
		<div className="flex flex-col w-full h-screen">
			<Header
				activeScripts={[]}
				onToggle={() => {}}
				onSelectAll={() => {}}
				onNavigate={handleNavigateHome}
				currentView="table"
			/>

			{/* Search */}
			<div className="flex justify-center px-6 py-8">
				<input
					ref={searchInputRef}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search kana, romaji or meaning..."
					className="bg-background px-6 py-3.5 focus:border-primary border-b-5 focus:outline-none w-full max-w-3xl placeholder:text-muted-foreground text-base"
				/>
			</div>

			<div className="flex-1 space-y-20 p-6 md:p-12 overflow-y-auto">
				{/* Hiragana */}
				{hiraganaItems.length > 0 && (
					<CharacterSection title="Hiragana" items={hiraganaItems} />
				)}

				{/* Katakana */}
				{katakanaItems.length > 0 && (
					<CharacterSection title="Katakana" items={katakanaItems} />
				)}

				{/* Kanji */}
				{kanjiItems.length > 0 && <CharacterSection title="Kanji" items={kanjiItems} />}

				{/* Empty State */}
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

/* ====================== */
/* SECTION */
/* ====================== */

function CharacterSection({ title, items }: { title: string; items: JapaneseItem[] }) {
	return (
		<section>
			<SectionHeader title={title} />

			<div className="gap-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
				{items.map((item) => {
					const uniqueKey = item.type === "kanji" 
						? `${item.type}-${item.kanji}` 
						: `${item.type}-${item.kana}`;

					return (
						<CharacterCard key={uniqueKey} item={item} />
					);
				})}
			</div>
		</section>
	);
}
/* ====================== */
/* HEADER */
/* ====================== */

function SectionHeader({ title }: { title: string }) {
	return (
		<div className="flex items-center gap-10 mb-8">
			<h1 className="font-bold text-accent text-4xl tracking-tight">{title}</h1>

			<div className="flex-1 bg-accent h-1" />
		</div>
	);
}

/* ====================== */
/* CARD */
/* ====================== */

function CharacterCard({ item }: { item: JapaneseItem }) {
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
