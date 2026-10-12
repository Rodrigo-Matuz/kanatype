import "@/App.css";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Display from "@/components/Display";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { getPracticePool, type PracticeSelection } from "@/data/practice-pool";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { JLPTLevel } from "@/lib/jlpt/filter";
import { pickNext } from "@/lib/practice";
import TablePage from "@/pages/Table";
import type { JapaneseItem, ScriptType } from "@/types";

const allScripts: ScriptType[] = ["hiragana", "katakana", "kanji"];
const defaultSelection: PracticeSelection = { mode: "reading", level: 5, scope: "through" };

function savedSelection(): PracticeSelection {
	try {
		const saved = JSON.parse(localStorage.getItem("kanatype-practice-selection") ?? "null");
		if (
			saved &&
			["reading", "meaning"].includes(saved.mode) &&
			[1, 2, 3, 4, 5].includes(saved.level) &&
			["through", "exact"].includes(saved.scope)
		) {
			return saved;
		}
	} catch {
		/* Private mode or invalid saved value: use a safe default. */
	}
	return defaultSelection;
}

export default function App() {
	const { language, t } = useLanguage();
	const navigate = useNavigate();
	const location = useLocation();
	const [activeScripts, setActiveScripts] = useState<ScriptType[]>(["hiragana"]);
	const [selection, setSelection] = useState<PracticeSelection>(savedSelection);
	const [currentItem, setCurrentItem] = useState<JapaneseItem>(() =>
		pickNext(getPracticePool(["hiragana"], defaultSelection, language), null),
	);
	const [completed, setCompleted] = useState(0);
	const [streak, setStreak] = useState(0);
	const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const previousLanguage = useRef(language);
	useEffect(() => {
		if (previousLanguage.current === language) return;
		previousLanguage.current = language;
		const credited = advanceTimer.current !== null;
		if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
		advanceTimer.current = null;
		setCurrentItem((previous) => {
			const pool = getPracticePool(activeScripts, selection, language);
			if (credited) return pickNext(pool, previous);
			return (
				pool.find(
					(item) =>
						item.type === previous.type &&
						(item.type === "kanji"
							? item.kanji === (previous as typeof item).kanji &&
								item.question === (previous as typeof item).question
							: item.kana === (previous as typeof item).kana),
				) ?? pickNext(pool, previous)
			);
		});
	}, [language, activeScripts, selection]);
	useEffect(() => {
		document.title = t("app.title");
		const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
		if (description) description.content = t("practice.intro");
	}, [t]);

	useEffect(
		() => () => {
			if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
		},
		[],
	);
	useEffect(() => {
		try {
			localStorage.setItem("kanatype-practice-selection", JSON.stringify(selection));
		} catch {
			/* Storage may be disabled. */
		}
	}, [selection]);
	useEffect(() => {
		if (location.pathname !== "/" && advanceTimer.current !== null) {
			clearTimeout(advanceTimer.current);
			advanceTimer.current = null;
			// The answer was credited already; don't offer it again on return.
			setCurrentItem((previous) =>
				pickNext(getPracticePool(activeScripts, selection, language), previous),
			);
		}
	}, [location.pathname, activeScripts, selection, language]);

	function cancelAdvance() {
		if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
		advanceTimer.current = null;
	}

	function chooseScripts(scripts: ScriptType[]) {
		cancelAdvance();
		setActiveScripts(scripts);
		setCurrentItem((previous) =>
			pickNext(getPracticePool(scripts, selection, language), previous),
		);
	}

	function chooseSelection(next: PracticeSelection) {
		cancelAdvance();
		setSelection(next);
		setCurrentItem((previous) =>
			pickNext(getPracticePool(activeScripts, next, language), previous),
		);
	}

	function toggleScript(script: ScriptType) {
		if (activeScripts.includes(script)) {
			if (activeScripts.length > 1) {
				chooseScripts(activeScripts.filter((value) => value !== script));
			}
			return;
		}
		chooseScripts([...activeScripts, script]);
	}

	function advance() {
		setCurrentItem((previous) =>
			pickNext(getPracticePool(activeScripts, selection, language), previous),
		);
	}

	function handleCorrect() {
		if (advanceTimer.current !== null) return;
		setCompleted((value) => value + 1);
		setStreak((value) => value + 1);
		// Credit the answer now; keep the current prompt briefly for visible feedback.
		advanceTimer.current = setTimeout(() => {
			advanceTimer.current = null;
			advance();
		}, 550);
	}

	function handleSkip() {
		setStreak(0);
		advance();
	}
	const kanjiCount = getPracticePool(["kanji"], selection, language).length;
	const englishCount =
		language === "pt-BR" && selection.mode === "meaning"
			? getPracticePool(["kanji"], selection, "en").length
			: kanjiCount;

	return (
		<Routes>
			<Route
				path="/"
				element={
					<div className="app-shell">
						<Header
							mode="practice"
							activeScripts={activeScripts}
							onToggle={toggleScript}
							onSelectAll={() => chooseScripts(allScripts)}
							onNavigate={() => navigate("/table")}
						/>
						<main className="practice-main">
							<div className="practice-intro">
								<p className="eyebrow">{t("practice.eyebrow")}</p>
								<h1>{t("practice.title")}</h1>
								<p>{t("practice.intro")}</p>
							</div>
							{activeScripts.includes("kanji") && (
								<section
									className="level-controls"
									aria-label={t("practice.settings.label")}
								>
									<label htmlFor="kanji-mode">
										{t("practice.settings.questions")}
										<select
											id="kanji-mode"
											value={selection.mode}
											onChange={(event) =>
												chooseSelection({
													...selection,
													mode: event.target
														.value as PracticeSelection["mode"],
												})
											}
										>
											<option value="reading">
												{t("practice.settings.readings")}
											</option>
											<option value="meaning">
												{t("practice.settings.meanings")}
											</option>
										</select>
									</label>
									{selection.mode === "meaning" && (
										<>
											<label htmlFor="jlpt-level">
												{t("practice.settings.level")}
												<select
													id="jlpt-level"
													value={selection.level}
													onChange={(event) =>
														chooseSelection({
															...selection,
															level: Number(
																event.target.value,
															) as JLPTLevel,
														})
													}
												>
													{[5, 4, 3, 2, 1].map((level) => (
														<option value={level} key={level}>
															N{level}
														</option>
													))}
												</select>
											</label>
											<label htmlFor="jlpt-scope">
												{t("practice.settings.coverage")}
												<select
													id="jlpt-scope"
													value={selection.scope}
													onChange={(event) =>
														chooseSelection({
															...selection,
															scope: event.target
																.value as PracticeSelection["scope"],
														})
													}
												>
													<option value="through">
														{t("practice.coverage.through", {
															level: selection.level,
														})}
													</option>
													<option value="exact">
														{t("practice.coverage.exact", {
															level: selection.level,
														})}
													</option>
												</select>
											</label>
										</>
									)}
									<p>
										{t("practice.count", {
											count: kanjiCount,
											description:
												selection.mode === "reading"
													? t("practice.count.readings")
													: t(
															language === "pt-BR"
																? "practice.count.meaningsPt"
																: "practice.count.meanings",
														),
										})}
									</p>
									{language === "pt-BR" &&
										selection.mode === "meaning" &&
										kanjiCount < englishCount && (
											<p>
												{t("practice.count.partial", {
													count: kanjiCount,
													total: englishCount,
												})}
											</p>
										)}
								</section>
							)}
							<div className="practice-card">
								<div className="practice-card-top">
									<span>
										{t(`app.scripts.${currentItem.type}`).toUpperCase()}
									</span>
									<span>{t("practice.card.tagline")}</span>
								</div>
								<Display item={currentItem} />
								<Input
									key={`${language}-${currentItem.type}-${currentItem.type === "kanji" ? currentItem.kanji : currentItem.kana}-${selection.mode}-${selection.level}-${selection.scope}`}
									currentItem={currentItem}
									onCorrect={handleCorrect}
									onSkip={handleSkip}
									onWrong={() => setStreak(0)}
								/>
							</div>
							<section
								className="practice-stats"
								aria-label={t("practice.progress.label")}
							>
								<span>{t("practice.progress.answered", { count: completed })}</span>
								<span>{t("practice.progress.streak", { count: streak })}</span>
							</section>
						</main>
						<footer className="app-footer">
							<span>{t("practice.footer.tagline")}</span>
							<a
								href="https://github.com/Rodrigo-Matuz/kanatype"
								target="_blank"
								rel="noopener noreferrer"
							>
								{t("practice.footer.github")}{" "}
								<ExternalLink aria-hidden="true" size={14} />
							</a>
							<a
								href="https://github.com/Rodrigo-Matuz/kanatype/blob/main/docs/DATA_SOURCES.md"
								target="_blank"
								rel="noopener noreferrer"
							>
								{t("practice.footer.sources")}{" "}
								<ExternalLink aria-hidden="true" size={14} />
							</a>
						</footer>
					</div>
				}
			/>
			<Route path="/table" element={<TablePage />} />
		</Routes>
	);
}
