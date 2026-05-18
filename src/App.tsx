import "@/App.css";
import { useEffect, useRef, useState } from "react";
import Display from "@/components/Display";
import Header from "@/components/Header";
import Input from "@/components/Input";
import type { ScriptType } from "@/data";
import type { DisplayHandle } from "@/types/displayTypes";

export default function App() {
	const [activeScripts, setActiveScripts] = useState<ScriptType[]>(["hiragana"]);
	const [currentItem, setCurrentItem] = useState<any>(null);

	const displayRef = useRef<DisplayHandle>(null);

	// Refresh display when scripts change
	useEffect(() => {
		displayRef.current?.next();
	}, []);

	function handleNavigate() {
		console.log("Switch to kana table page");
	}

	function toggleScript(script: ScriptType) {
		setActiveScripts((prev) => {
			if (prev.includes(script)) {
				if (prev.length === 1) return prev; // prevent emptying
				return prev.filter((s) => s !== script);
			} else {
				return [...prev, script];
			}
		});
	}

	function selectAll() {
		setActiveScripts(["hiragana", "katakana", "kanji"]);
	}

	function handleCorrectAnswer() {
		displayRef.current?.next();
	}

	return (
		<div className="flex flex-col w-full h-screen">
			<Header
				activeScripts={activeScripts}
				onToggle={toggleScript}
				onSelectAll={selectAll}
				onNavigate={handleNavigate}
			/>

			<div className="flex flex-col justify-start items-center pt-40 h-[40vh]">
				<Display
					ref={displayRef}
					scriptTypes={activeScripts}
					onChange={setCurrentItem}
				/>

				<Input currentItem={currentItem} onCorrect={handleCorrectAnswer} />
			</div>
		</div>
	);
}
