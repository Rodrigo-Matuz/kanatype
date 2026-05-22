import { useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/ui/kbd";

import type { JapaneseItem } from "@/types";

/**
 * Random motivational messages shown after correct answers
 */
const motivationalPhrases = [
	"Great job!",
	"Nice!",
	"Perfect!",
	"You're killing it!",
	"Awesome!",
	"Well done!",
	"Correct!",
	"Excellent!",
];

type Props = {
	currentItem: JapaneseItem | null;
	onCorrect: () => void;
};

/**
 * Input component
 *
 * Handles user input, answer validation, and keyboard shortcuts:
 * - Enter → verify answer
 * - Tab   → reveal romaji hint
 */
export default function Input({ currentItem, onCorrect }: Props) {
	const [answer, setAnswer] = useState("");
	const [hintType, setHintType] = useState<"verify" | "success" | "error" | "hint">("verify");
	const [hintText, setHintText] = useState("Press Enter to verify");
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	/**
	 * Reset everything when a new character is loaded
	 */
	useEffect(() => {
		inputRef.current?.focus();

		setAnswer("");
		setHintType("verify");
		setHintText("Press Enter to verify");
		setIsError(false);
		setIsSuccess(false);
	}, []);

	/**
	 * Reveal romaji hint
	 */
	const revealHint = () => {
		if (!currentItem) return;

		setHintType("hint");
		setHintText(`Hint: ${currentItem.romaji}`);
	};

	/**
	 * Validate user's answer
	 */
	const checkAnswer = () => {
		if (!currentItem || !answer.trim()) return;

		const userAnswer = answer.trim().toLowerCase();
		const correctAnswer = currentItem.romaji.toLowerCase();

		if (userAnswer === correctAnswer) {
			const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

			setHintType("success");
			setHintText(randomPhrase);
			setIsSuccess(true);
			setAnswer("");

			setTimeout(() => {
				setIsSuccess(false);
				onCorrect(); // This will trigger new currentItem → reset
			}, 650);
		} else {
			setIsError(true);
			setHintType("error");
			setHintText("Try again");
			setAnswer("");

			setTimeout(() => {
				setIsError(false);
				setHintType("verify");
				setHintText("Press Enter to verify");
			}, 900);
		}
	};

	/**
	 * Keyboard shortcuts
	 */
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			checkAnswer();
		} else if (e.key === "Tab") {
			e.preventDefault();
			revealHint();
		}
	};

	return (
		<div className="flex flex-col items-center mx-auto w-full max-w-md">
			<input
				ref={inputRef}
				type="text"
				value={answer}
				onChange={(e) => setAnswer(e.target.value)}
				onKeyDown={handleKeyDown}
				className={`w-full outline-none focus-visible:ring-0 text-center text-3xl py-5 border-b-5 transition-all duration-200 focus:outline-none
					${isError ? "border-destructive" : isSuccess ? "border-chart-1" : "border-gray-300 focus:accent"}`}
				placeholder="romaji..."
				autoComplete="off"
				spellCheck={false}
			/>

			{/* Hint / Feedback Area */}
			<div className="flex flex-col items-center gap-1 mt-5 h-12 text-gray-500 text-sm">
				{/* Main hint text */}
				<div className="text-muted-foreground text-sm">
					{hintType === "verify" && (
						<>
							Press <Kbd>Enter</Kbd> to verify
						</>
					)}

					{hintType === "success" && hintText}
					{hintType === "error" && hintText}
					{hintType === "hint" && hintText}
				</div>

				{/* Tab hint instruction - always visible when in verify mode */}
				{hintType === "verify" && (
					<div className="text-muted-foreground text-xs">
						Press <Kbd>Tab</Kbd> to reveal hint
					</div>
				)}
			</div>
		</div>
	);
}