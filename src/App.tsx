import "@/App.css";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Display from "@/components/Display";
import Header from "@/components/Header";
import Input from "@/components/Input";
import TablePage from "@/pages/Table";
import type { DisplayHandle, ScriptType } from "@/types";

/**
 * Main application component
 *
 * Responsibilities:
 * - Manage active script types (Hiragana, Katakana, Kanji)
 * - Coordinate between Header, Display, and Input
 * - Handle routing between learning mode and table view
 */
export default function App() {
	const navigate = useNavigate();

	const [activeScripts, setActiveScripts] = useState<ScriptType[]>(["hiragana"]);
	const [currentItem, setCurrentItem] = useState<any>(null);

	const displayRef = useRef<DisplayHandle>(null);

	// Load first item on initial mount
	useEffect(() => {
		displayRef.current?.next();
	}, []);

	const handleNavigate = () => navigate("/table");

	/**
	 * Toggle a script type (with safeguard: at least one must remain active)
	 */
	function toggleScript(script: ScriptType) {
		setActiveScripts((prev) => {
			if (prev.includes(script)) {
				if (prev.length === 1) return prev; // Prevent disabling all
				return prev.filter((s) => s !== script);
			}
			return [...prev, script];
		});
	}

	/**
	 * Enable all script types
	 */
	function selectAll() {
		setActiveScripts(["hiragana", "katakana", "kanji"]);
	}

	/**
	 * Advance to next character when user answers correctly
	 */
	function handleCorrectAnswer() {
		displayRef.current?.next();
	}

	return (
		<Routes>
			<Route
				path="/"
				element={
					<div className="flex flex-col w-full h-screen">
						<Header
							activeScripts={activeScripts}
							onToggle={toggleScript}
							onSelectAll={selectAll}
							onNavigate={handleNavigate}
							currentView="learn"
						/>

						<div className="flex flex-col flex-1 justify-start items-center pt-40">
							<Display
								key={activeScripts.sort().join(",")} // Important: Forces remount when scripts change
								ref={displayRef}
								scriptTypes={activeScripts}
								onChange={setCurrentItem}
							/>

							<Input currentItem={currentItem} onCorrect={handleCorrectAnswer} />
						</div>

						{/* Bottom Footer */}
						<footer className="mt-auto py-6 border-border border-t text-muted-foreground text-sm text-center">
							<div className="flex flex-wrap justify-center items-center gap-3">
								<span>
								Made with <span className="text-accent">♥</span> by
								</span>

								<a
									href="https://github.com/Rodrigo-Matuz"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 hover:text-accent underline underline-offset-4 transition-colors"
								>
									<ExternalLink className="w-4 h-4" />
									Rodrigo-Matuz
								</a>

								<span>•</span>

								<a
									href="https://github.com/Rodrigo-Matuz/kanatype"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 hover:text-accent underline underline-offset-4 transition-colors"
								>
									<ExternalLink className="w-4 h-4" />
									View on GitHub
								</a>
							</div>
						</footer>
					</div>
				}
			/>
			<Route path="/table" element={<TablePage />} />
		</Routes>
	);
}
