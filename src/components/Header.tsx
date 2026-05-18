import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import type { ScriptType } from "@/data";

const scriptOptions: { key: ScriptType; label: string }[] = [
	{ key: "hiragana", label: "Hiragana" },
	{ key: "katakana", label: "Katakana" },
	{ key: "kanji", label: "Kanji" },
];

export default function Header({
	activeScripts,
	onToggle,
	onSelectAll,
	onNavigate,
}: {
	activeScripts: ScriptType[];
	onToggle: (script: ScriptType) => void;
	onSelectAll: () => void;
	onNavigate: () => void;
}) {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<header className="flex justify-between items-center bg-background p-5 border-b w-full">
			<div className="flex gap-2">
				{scriptOptions.map(({ key, label }) => (
					<Button
						key={key}
						variant={activeScripts.includes(key) ? "default" : "outline"}
						onClick={() => onToggle(key)}
						size="lg"
					>
						{label}
					</Button>
				))}

				<Button variant="ghost" onClick={onSelectAll} size="lg">
					All
				</Button>
			</div>

			<div className="flex gap-2">
				<Button type="button" onClick={onNavigate} size="lg">
					View Table
				</Button>

				<Button type="button" onClick={toggleTheme} size="lg">
					{theme === "dark" ? "Light Mode" : "Dark Mode"}
				</Button>
			</div>
		</header>
	);
}
