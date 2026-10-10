import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ArrowLeft, BookOpen, Layers3, Maximize2, Minus, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import type { ScriptType } from "@/types";

const scriptOptions: { key: ScriptType; label: string }[] = [
	{ key: "hiragana", label: "Hiragana" },
	{ key: "katakana", label: "Katakana" },
	{ key: "kanji", label: "Kanji" },
];

type HeaderProps =
	| {
			mode: "practice";
			activeScripts: ScriptType[];
			onToggle: (script: ScriptType) => void;
			onSelectAll: () => void;
			onNavigate: () => void;
	  }
	| { mode: "table"; onNavigate: () => void };

export default function Header(props: HeaderProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const isDark = resolvedTheme === "dark";
	const nativeWindow = isTauri() ? getCurrentWindow() : null;

	return (
		<header className="app-header">
			<div
				className={nativeWindow ? "header-leading draggable" : "header-leading"}
				data-tauri-drag-region
			>
				<span className="brand-mark" aria-hidden="true" data-tauri-drag-region>
					カ
				</span>
				<div className="brand-copy" data-tauri-drag-region>
					<strong data-tauri-drag-region>KanataType</strong>
					<span data-tauri-drag-region>YOUR JAPANESE PRACTICE SPACE</span>
				</div>
			</div>

			{props.mode === "practice" ? (
				<fieldset className="script-switcher">
					<legend className="sr-only">Practice scripts</legend>
					{scriptOptions.map(({ key, label }) => (
						<Button
							key={key}
							type="button"
							variant={props.activeScripts.includes(key) ? "default" : "outline"}
							aria-pressed={props.activeScripts.includes(key)}
							onClick={() => props.onToggle(key)}
							size="sm"
						>
							{label}
						</Button>
					))}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={props.onSelectAll}
						aria-label="Practice all scripts"
					>
						<Layers3 aria-hidden="true" size={16} /> All
					</Button>
				</fieldset>
			) : (
				<span className="header-section-label">CHARACTER REFERENCE</span>
			)}

			<nav className="header-actions" aria-label="App navigation">
				<Button type="button" variant="outline" size="sm" onClick={props.onNavigate}>
					{props.mode === "table" ? (
						<ArrowLeft aria-hidden="true" size={16} />
					) : (
						<BookOpen aria-hidden="true" size={16} />
					)}
					{props.mode === "table" ? "Practice" : "Reference"}
				</Button>
				<Button
					type="button"
					variant="outline"
					size="icon-sm"
					onClick={() => setTheme(isDark ? "light" : "dark")}
					aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
				>
					{isDark ? (
						<Sun aria-hidden="true" size={18} />
					) : (
						<Moon aria-hidden="true" size={18} />
					)}
				</Button>
				{nativeWindow && (
					<fieldset className="window-controls">
						<legend className="sr-only">Window controls</legend>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Minimize window"
							onClick={() => void nativeWindow.minimize()}
						>
							<Minus aria-hidden="true" size={16} />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Toggle maximize"
							onClick={() => void nativeWindow.toggleMaximize()}
						>
							<Maximize2 aria-hidden="true" size={16} />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Close window"
							onClick={() => void nativeWindow.close()}
						>
							<X aria-hidden="true" size={16} />
						</Button>
					</fieldset>
				)}
			</nav>
		</header>
	);
}
