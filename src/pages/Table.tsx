import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterSection } from "@/components/CharacterSection";
import Header from "@/components/Header";
import { getDataByTypes } from "@/data";
import { curriculumKanji } from "@/data/practice-pool";
import type { JapaneseItem, KanaItem } from "@/types";

const curriculumGlyphs = new Set(curriculumKanji.map((item) => item.kanji));
const allItems: JapaneseItem[] = [
	...getDataByTypes(["hiragana", "katakana"]),
	...curriculumKanji,
	...getDataByTypes(["kanji"]).filter(
		(item) => item.type === "kanji" && !curriculumGlyphs.has(item.kanji),
	),
];

export default function TablePage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [visibleKanji, setVisibleKanji] = useState(120);
	const searchInputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		searchInputRef.current?.focus();
	}, []);

	const filteredItems = useMemo(() => {
		const query = search.toLowerCase().trim();
		if (!query) return allItems;
		return allItems.filter((item) =>
			item.type === "kanji"
				? item.kanji.includes(query) ||
					(item.question === "meaning"
						? item.meanings.some((meaning) => meaning.toLowerCase().includes(query)) ||
							[...item.onReadings, ...item.kunReadings].some((reading) =>
								reading.includes(query),
							) ||
							`n${item.jlptLevel}` === query
						: item.meaning.toLowerCase().includes(query) ||
							item.romaji.toLowerCase().includes(query))
				: item.kana.includes(query) || item.romaji.toLowerCase().includes(query),
		);
	}, [search]);

	const hiraganaItems = filteredItems.filter(
		(item): item is KanaItem => item.type === "hiragana",
	);
	const katakanaItems = filteredItems.filter(
		(item): item is KanaItem => item.type === "katakana",
	);
	const kanjiItems = filteredItems.filter((item) => item.type === "kanji");

	return (
		<div className="app-shell reference-shell">
			<Header mode="table" onNavigate={() => navigate("/")} />
			<main className="reference-main">
				<div className="reference-intro">
					<div>
						<p className="eyebrow">THE LIBRARY / 02 · ALL LEVELS</p>
						<h1>Character reference.</h1>
						<p>
							This reference spans all levels, regardless of practice filters. Search
							by character, Japanese dictionary reading, meaning, or N-level.
							JLPT-aligned study sets are not official exam requirements.
						</p>
					</div>
					<span className="result-count">
						{filteredItems.length}{" "}
						{filteredItems.length === 1 ? "character" : "characters"}
					</span>
				</div>
				<div className="search-control">
					<Search aria-hidden="true" size={20} />
					<label htmlFor="character-search" className="sr-only">
						Search kana or kanji, Japanese dictionary readings (not kanji romaji),
						meanings, or N-levels
					</label>
					<input
						id="character-search"
						ref={searchInputRef}
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setVisibleKanji(120);
						}}
						placeholder="Search kanji, Japanese dictionary readings, meanings, N-levels…"
						spellCheck={false}
					/>
				</div>
				<div className="reference-sections">
					<CharacterSection title="Hiragana" items={hiraganaItems} />
					<CharacterSection title="Katakana" items={katakanaItems} />
					<CharacterSection title="Kanji" items={kanjiItems.slice(0, visibleKanji)} />
					{kanjiItems.length > visibleKanji && (
						<button
							type="button"
							className="load-kanji"
							onClick={() => setVisibleKanji((count) => count + 120)}
						>
							Showing {visibleKanji} of {kanjiItems.length} kanji · Show more
						</button>
					)}
					{filteredItems.length === 0 && (
						<p className="empty-results">
							No matches for “{search}”. Try another reading or character.
						</p>
					)}
				</div>
				<details className="data-sources">
					<summary>About these kanji study sets &amp; data sources</summary>
					<p>
						These are unofficial, JLPT-aligned community study sets—not a list of kanji
						required by the exam. N5 is introductory; N1 is advanced. The complete set
						contains 2,211 kanji. English glosses are dictionary senses, not
						context-specific translations. Readings in the reference are dictionary
						metadata, not automatic answers.
					</p>
					<p>
						Kanji readings and English meanings are adapted from{" "}
						<a
							href="https://www.edrdg.org/wiki/KANJIDIC_Project.html"
							target="_blank"
							rel="noopener noreferrer"
						>
							EDRDG KANJIDIC2
						</a>{" "}
						(copyright James William Breen, EDRDG and EDRDG contributors), licensed
						under{" "}
						<a
							href="https://creativecommons.org/licenses/by-sa/4.0/"
							target="_blank"
							rel="noopener noreferrer"
						>
							CC BY-SA 4.0
						</a>
						; see the{" "}
						<a
							href="https://www.edrdg.org/edrdg/licence.html"
							target="_blank"
							rel="noopener noreferrer"
						>
							EDRDG licence and acknowledgements
						</a>
						. KanataType extracts selected dictionary fields, joins them to level
						assignments, filters to mapped kanji, and reformats the result as JSON. The
						adapted dictionary metadata remains under CC BY-SA 4.0. Level assignments
						come from{" "}
						<a
							href="https://www.tanos.co.uk/jlpt/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Tanos JLPT resources
						</a>
						, via{" "}
						<a
							href="https://github.com/onlyskin/kanjiapi.dev"
							target="_blank"
							rel="noopener noreferrer"
						>
							KanjiAPI
						</a>
						. Tanos shares its lists under CC BY (version unspecified) and asks for
						credit to the site. KanjiAPI compiled the level mapping. See the{" "}
						<a
							href="https://github.com/Rodrigo-Matuz/kanatype/blob/main/docs/DATA_SOURCES.md"
							target="_blank"
							rel="noopener noreferrer"
						>
							source and license details
						</a>
						.
					</p>
				</details>
			</main>
		</div>
	);
}
