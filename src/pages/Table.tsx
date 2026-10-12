import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterSection } from "@/components/CharacterSection";
import Header from "@/components/Header";
import { getDataByTypes } from "@/data";
import { getLocalizedMeanings } from "@/data/jlpt/meanings";
import { curriculumKanji } from "@/data/practice-pool";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Language } from "@/i18n/translation";
import { normalizeMeaningAnswer } from "@/lib/practice";
import type { JapaneseItem, KanaItem } from "@/types";

const curriculumGlyphs = new Set(curriculumKanji.map((item) => item.kanji));
const allItems: JapaneseItem[] = [
	...getDataByTypes(["hiragana", "katakana"]),
	...curriculumKanji,
	...getDataByTypes(["kanji"]).filter(
		(item) => item.type === "kanji" && !curriculumGlyphs.has(item.kanji),
	),
];

export function filterReferenceItems(
	items: JapaneseItem[],
	query: string,
	language: Language,
): JapaneseItem[] {
	const trimmed = query.toLowerCase().trim();
	const meaningQuery = normalizeMeaningAnswer(query);
	if (!trimmed) return items;
	return items.filter((item) => {
		if (item.type === "kanji" && item.question === "meaning") {
			const meanings = getLocalizedMeanings(item, language) ?? [];
			return (
				item.kanji.includes(trimmed) ||
				meanings.some((meaning) =>
					normalizeMeaningAnswer(meaning).includes(meaningQuery),
				) ||
				[...item.onReadings, ...item.kunReadings].some((reading) =>
					reading.includes(trimmed),
				) ||
				`n${item.jlptLevel}` === trimmed
			);
		}
		if (item.type === "kanji") {
			const meanings = getLocalizedMeanings(item, language) ?? [];
			return (
				item.kanji.includes(trimmed) ||
				item.romaji.toLowerCase().includes(trimmed) ||
				meanings.some((meaning) => normalizeMeaningAnswer(meaning).includes(meaningQuery))
			);
		}
		return item.kana.includes(trimmed) || item.romaji.toLowerCase().includes(trimmed);
	});
}

export default function TablePage() {
	const navigate = useNavigate();
	const { language, t } = useLanguage();
	const [search, setSearch] = useState("");
	const [visibleKanji, setVisibleKanji] = useState(120);
	const searchInputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		searchInputRef.current?.focus();
	}, []);

	const filteredItems = useMemo(
		() => filterReferenceItems(allItems, search, language),
		[search, language],
	);

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
						<p className="eyebrow">{t("reference.eyebrow")}</p>
						<h1>{t("reference.title")}</h1>
						<p>{t("reference.intro")}</p>
					</div>
					<span className="result-count">
						{t(
							filteredItems.length === 1
								? "reference.count.one"
								: "reference.count.other",
							{
								count: filteredItems.length,
							},
						)}
					</span>
				</div>
				<div className="search-control">
					<Search aria-hidden="true" size={20} />
					<label htmlFor="character-search" className="sr-only">
						{t("reference.search.label")}
					</label>
					<input
						id="character-search"
						ref={searchInputRef}
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setVisibleKanji(120);
						}}
						placeholder={t("reference.search.placeholder")}
						spellCheck={false}
					/>
				</div>
				<div className="reference-sections">
					<CharacterSection
						title={t("reference.section.hiragana")}
						items={hiraganaItems}
					/>
					<CharacterSection
						title={t("reference.section.katakana")}
						items={katakanaItems}
					/>
					<CharacterSection
						title={t("reference.section.kanji")}
						items={kanjiItems.slice(0, visibleKanji)}
					/>
					{kanjiItems.length > visibleKanji && (
						<button
							type="button"
							className="load-kanji"
							onClick={() => setVisibleKanji((count) => count + 120)}
						>
							{t("reference.loadMore", {
								visible: visibleKanji,
								total: kanjiItems.length,
							})}
						</button>
					)}
					{filteredItems.length === 0 && (
						<p className="empty-results">{t("reference.empty", { query: search })}</p>
					)}
				</div>
				<details className="data-sources">
					<summary>{t("reference.sources.summary")}</summary>
					<p>{t("reference.sources.overview")}</p>
					<p>
						{t("reference.sources.dictionary.before")}{" "}
						<a
							href="https://www.edrdg.org/wiki/KANJIDIC_Project.html"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("reference.sources.kanjidic")}
						</a>{" "}
						{t("reference.sources.dictionary.after")}{" "}
						<a
							href="https://creativecommons.org/licenses/by-sa/4.0/"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("reference.sources.dictionary.license")}
						</a>
						; {t("reference.sources.dictionary.seeThe")}{" "}
						<a
							href="https://www.edrdg.org/edrdg/licence.html"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("reference.sources.dictionary.ack")}
						</a>
						. {t("reference.sources.dictionary.transforms")}{" "}
						<a
							href="https://www.tanos.co.uk/jlpt/"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("reference.sources.tanos")}
						</a>
						, {t("reference.sources.levels.via")}{" "}
						<a
							href="https://github.com/onlyskin/kanjiapi.dev"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("reference.sources.kanjiapi")}
						</a>
						. {t("reference.sources.levels.after")}{" "}
						<a
							href="https://github.com/Rodrigo-Matuz/kanatype/blob/main/docs/DATA_SOURCES.md"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t("reference.sources.details")}
						</a>
						.
					</p>
				</details>
			</main>
		</div>
	);
}
