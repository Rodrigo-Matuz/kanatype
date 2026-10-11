import "@/App.css";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Display from "@/components/Display";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { getPracticePool, type PracticeSelection } from "@/data/practice-pool";
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
	const navigate = useNavigate();
	const location = useLocation();
	const [activeScripts, setActiveScripts] = useState<ScriptType[]>(["hiragana"]);
	const [selection, setSelection] = useState<PracticeSelection>(savedSelection);
	const [currentItem, setCurrentItem] = useState<JapaneseItem>(() =>
		pickNext(getPracticePool(["hiragana"], defaultSelection), null),
	);
	const [completed, setCompleted] = useState(0);
	const [streak, setStreak] = useState(0);
	const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
				pickNext(getPracticePool(activeScripts, selection), previous),
			);
		}
	}, [location.pathname, activeScripts, selection]);

	function cancelAdvance() {
		if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
		advanceTimer.current = null;
	}

	function chooseScripts(scripts: ScriptType[]) {
		cancelAdvance();
		setActiveScripts(scripts);
		setCurrentItem((previous) => pickNext(getPracticePool(scripts, selection), previous));
	}

	function chooseSelection(next: PracticeSelection) {
		cancelAdvance();
		setSelection(next);
		setCurrentItem((previous) => pickNext(getPracticePool(activeScripts, next), previous));
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
		setCurrentItem((previous) => pickNext(getPracticePool(activeScripts, selection), previous));
	}

	function handleCorrect() {
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
	const kanjiCount = getPracticePool(["kanji"], selection).length;

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
								<p className="eyebrow">JAPANESE TYPING PRACTICE / 01</p>
								<h1>Learn one character at a time.</h1>
								<p>
									Practice kana and curated readings, or recognize JLPT-aligned
									kanji meanings.
								</p>
							</div>
							{activeScripts.includes("kanji") && (
								<section
									className="level-controls"
									aria-label="Kanji study settings"
								>
									<label htmlFor="kanji-mode">
										Kanji questions
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
											<option value="reading">Curated romaji readings</option>
											<option value="meaning">JLPT-aligned meanings</option>
										</select>
									</label>
									{selection.mode === "meaning" && (
										<>
											<label htmlFor="jlpt-level">
												Study level
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
												Coverage
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
														Through N{selection.level} (cumulative)
													</option>
													<option value="exact">
														N{selection.level} only
													</option>
												</select>
											</label>
										</>
									)}
									<p>
										{kanjiCount} kanji prompts ·{" "}
										{selection.mode === "meaning"
											? "English dictionary glosses, not official JLPT requirements"
											: "curated romaji readings"}
										. Kana toggles are independent.
									</p>
								</section>
							)}
							<div className="practice-card">
								<div className="practice-card-top">
									<span>{currentItem.type.toUpperCase()}</span>
									<span>READ · TYPE · REMEMBER</span>
								</div>
								<Display item={currentItem} />
								<Input
									key={`${currentItem.type}-${currentItem.type === "kanji" ? currentItem.kanji : currentItem.kana}-${selection.mode}-${selection.level}-${selection.scope}`}
									currentItem={currentItem}
									onCorrect={handleCorrect}
									onSkip={handleSkip}
									onWrong={() => setStreak(0)}
								/>
							</div>
							<section className="practice-stats" aria-label="Practice progress">
								<span>
									<strong>{completed}</strong> answered
								</span>
								<span>
									<strong>{streak}</strong> in a row
								</span>
							</section>
						</main>
						<footer className="app-footer">
							<span>KanataType · Practice makes familiar.</span>
							<a
								href="https://github.com/Rodrigo-Matuz/kanatype"
								target="_blank"
								rel="noopener noreferrer"
							>
								Project on GitHub <ExternalLink aria-hidden="true" size={14} />
							</a>
							<a
								href="https://github.com/Rodrigo-Matuz/kanatype/blob/main/docs/DATA_SOURCES.md"
								target="_blank"
								rel="noopener noreferrer"
							>
								Data sources &amp; licenses{" "}
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
