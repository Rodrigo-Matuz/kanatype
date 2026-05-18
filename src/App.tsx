// App.tsx
import "@/App.css";
import { useEffect, useRef, useState } from "react";

import Display from "@/components/Display";
import Header from "@/components/Header";
import Input from "@/components/Input";
import type { DisplayHandle, ScriptType } from "@/types";

/**
 * Main application component
 *
 * Responsibilities:
 * - Manage which script types are active (hiragana/katakana/kanji)
 * - Control progression of displayed characters
 * - Coordinate communication between Display and Input components
 */
export default function App() {
	/**
	 * Active filters for what character sets should be used
	 * Example: ["hiragana", "katakana"]
	 */
	const [activeScripts, setActiveScripts] = useState<ScriptType[]>(["hiragana"]);

	/**
	 * Current item shown by Display component
	 * (character, romaji, meaning, etc.)
	 */
	const [currentItem, setCurrentItem] = useState<any>(null);

	/**
	 * Reference to Display component methods
	 * Used to manually trigger "next item"
	 */
	const displayRef = useRef<DisplayHandle>(null);

	/**
	 * NOTE:
	 * Runs once on mount (empty dependency array).
	 *
	 * Forces Display to load first item immediately.
	 */
	useEffect(() => {
		displayRef.current?.next();
	}, []);

	/**
	 * Navigation handler for future pages
	 * (e.g. switching to kana table / reference screen)
	 */
	function handleNavigate() {
		console.log("Switch to kana table page");
	}

	/**
	 * Toggle a script type ON/OFF
	 *
	 * Rules:
	 * - Prevents user from disabling ALL scripts (must always have at least 1)
	 */
	function toggleScript(script: ScriptType) {
		setActiveScripts((prev) => {
			// If already active → remove it
			if (prev.includes(script)) {
				// Prevent empty state (UI must always have at least one script)
				if (prev.length === 1) return prev;

				return prev.filter((s) => s !== script);
			}

			// If not active → add it
			return [...prev, script];
		});
	}

	/**
	 * Enable all available scripts at once
	 * Useful for "Select All" button in Header
	 */
	function selectAll() {
		setActiveScripts(["hiragana", "katakana", "kanji"]);
	}

	/**
	 * Called when user answers correctly
	 * Advances Display to next item
	 */
	function handleCorrectAnswer() {
		displayRef.current?.next();
	}

	return (
		<div className="flex flex-col w-full h-screen">
			{/* Top navigation / controls */}
			<Header
				activeScripts={activeScripts}
				onToggle={toggleScript}
				onSelectAll={selectAll}
				onNavigate={handleNavigate}
			/>

			{/* Main learning area */}
			<div className="flex flex-col justify-start items-center pt-40 h-[40vh]">
				{/* Character display */}
				<Display ref={displayRef} scriptTypes={activeScripts} onChange={setCurrentItem} />

				{/* User input / answer checking */}
				<Input currentItem={currentItem} onCorrect={handleCorrectAnswer} />
			</div>
		</div>
	);
}
