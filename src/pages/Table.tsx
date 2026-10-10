import { Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterSection } from "@/components/CharacterSection";
import Header from "@/components/Header";
import { getDataByTypes } from "@/data";
import type { KanaItem, KanjiItem } from "@/types";

const allItems = getDataByTypes(["hiragana", "katakana", "kanji"]);

export default function TablePage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

	const filteredItems = useMemo(() => {
		const query = search.toLowerCase().trim();
		if (!query) return allItems;
		return allItems.filter(
			(item) =>
				item.romaji.toLowerCase().includes(query) ||
				(item.type === "kanji"
					? item.kanji.includes(query) || item.meaning.toLowerCase().includes(query)
					: item.kana.includes(query)),
		);
	}, [search]);

	const hiraganaItems = filteredItems.filter(
		(item): item is KanaItem => item.type === "hiragana",
	);
	const katakanaItems = filteredItems.filter(
		(item): item is KanaItem => item.type === "katakana",
	);
	const kanjiItems = filteredItems.filter((item): item is KanjiItem => item.type === "kanji");

	return (
		<div className="app-shell reference-shell">
			<Header mode="table" onNavigate={() => navigate("/")} />
			<main className="reference-main">
				<div className="reference-intro">
					<div>
						<p className="eyebrow">THE LIBRARY / 02</p>
						<h1>Character reference.</h1>
						<p>Search by character, reading, or meaning.</p>
					</div>
					<span className="result-count">
						{filteredItems.length}{" "}
						{filteredItems.length === 1 ? "character" : "characters"}
					</span>
				</div>
				<div className="search-control">
					<Search aria-hidden="true" size={20} />
					<label htmlFor="character-search" className="sr-only">
						Search characters, romaji, or meaning
					</label>
					<input
						id="character-search"
						ref={searchInputRef}
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search kana, romaji, or meaning…"
						spellCheck={false}
					/>
				</div>
				<div className="reference-sections">
					<CharacterSection title="Hiragana" items={hiraganaItems} />
					<CharacterSection title="Katakana" items={katakanaItems} />
					<CharacterSection title="Kanji" items={kanjiItems} />
					{filteredItems.length === 0 && (
						<p className="empty-results">
							No matches for “{search}”. Try another reading or character.
						</p>
					)}
				</div>
			</main>
		</div>
	);
}
