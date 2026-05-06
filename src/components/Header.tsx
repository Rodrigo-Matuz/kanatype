import { Button } from "@/components/ui/button";
import type { Mode } from "@/types/headerTypes";

export default function Header({
	mode,
	onSwitch,
	onNavigate,
}: {
	mode: Mode;
	onSwitch: () => void;
	onNavigate: () => void;
}) {
	return (
		<header>
			<Button type="button" onClick={onSwitch}>
				Mode: {mode}
			</Button>

			<Button type="button" onClick={onNavigate}>
				View Table
			</Button>
		</header>
	);
}
