import "@/App.css";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Display from "@/components/Display";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { getDataByTypes } from "@/data";
import { pickNext } from "@/lib/practice";
import TablePage from "@/pages/Table";
import type { JapaneseItem, ScriptType } from "@/types";

const allScripts: ScriptType[] = ["hiragana", "katakana", "kanji"];

export default function App() {
	const navigate = useNavigate();
	const [activeScripts, setActiveScripts] = useState<ScriptType[]>(["hiragana"]);
	const [currentItem, setCurrentItem] = useState<JapaneseItem>(() =>
		pickNext(getDataByTypes(["hiragana"]), null),
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

	function chooseScripts(scripts: ScriptType[]) {
		if (advanceTimer.current !== null) {
			clearTimeout(advanceTimer.current);
			advanceTimer.current = null;
		}
		setActiveScripts(scripts);
		setCurrentItem((previous) => pickNext(getDataByTypes(scripts), previous));
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
		setCurrentItem((previous) => pickNext(getDataByTypes(activeScripts), previous));
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
								<p>Read the character, type its romaji, and build your rhythm.</p>
							</div>
							<div className="practice-card">
								<div className="practice-card-top">
									<span>{currentItem.type.toUpperCase()}</span>
									<span>READ · TYPE · REMEMBER</span>
								</div>
								<Display item={currentItem} />
								<Input
									key={`${currentItem.type}-${currentItem.type === "kanji" ? currentItem.kanji : currentItem.kana}`}
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
						</footer>
					</div>
				}
			/>
			<Route path="/table" element={<TablePage />} />
		</Routes>
	);
}
