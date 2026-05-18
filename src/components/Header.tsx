import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import type { ScriptType } from "@/types";

/**
 * Available script filter buttons shown in the header.
 *
 * This is UI configuration, not business logic.
 * (keeps rendering separate from app state logic)
 */
const scriptOptions: { key: ScriptType; label: string }[] = [
	{ key: "hiragana", label: "Hiragana" },
	{ key: "katakana", label: "Katakana" },
	{ key: "kanji", label: "Kanji" },
];

type HeaderProps = {
	/**
	 * Currently active script filters
	 * Used to visually highlight selected buttons
	 */
	activeScripts: ScriptType[];

	/**
	 * Toggle a single script on/off
	 */
	onToggle: (script: ScriptType) => void;

	/**
	 * Enable all scripts at once
	 */
	onSelectAll: () => void;

	/**
	 * Navigate to another view (e.g. table/reference screen)
	 */
	onNavigate: () => void;
};

/**
 * Header component
 *
 * Responsibilities:
 * - Script filtering controls
 * - Navigation entry point
 * - Theme switching
 *
 * NOTE: This is a "control header", not just UI decoration.
 */
export default function Header({ activeScripts, onToggle, onSelectAll, onNavigate }: HeaderProps) {
	const { theme, setTheme } = useTheme();

	/**
	 * Toggle between dark and light theme
	 *
	 * Uses current theme state from next-themes
	 */
	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<header className="flex justify-between items-center bg-background p-5 border-b w-full">
			{/* Left side: script filters */}
			<div className="flex gap-2">
				{scriptOptions.map(({ key, label }) => (
					<Button
						key={key}
						/**
						 * Active scripts are visually highlighted
						 * inactive ones are outlined
						 */
						variant={activeScripts.includes(key) ? "default" : "outline"}
						onClick={() => onToggle(key)}
						size="lg"
					>
						{label}
					</Button>
				))}

				{/* Quick enable all scripts */}
				<Button variant="ghost" onClick={onSelectAll} size="lg">
					All
				</Button>
			</div>

			{/* Right side: navigation + settings */}
			<div className="flex gap-2">
				{/* Switch to table/reference view */}
				<Button type="button" onClick={onNavigate} size="lg">
					View Table
				</Button>

				{/* Theme switcher */}
				<Button type="button" onClick={toggleTheme} size="lg">
					{theme === "dark" ? "Light Mode" : "Dark Mode"}
				</Button>
			</div>
		</header>
	);
}
