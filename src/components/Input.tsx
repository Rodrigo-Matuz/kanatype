import { useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import type { HiraganaItem } from "@/types/displayTypes";

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
	currentItem: HiraganaItem | null;
	onCorrect: () => void;
};

export default function Input({ currentItem, onCorrect }: Props) {
	const [answer, setAnswer] = useState("");
	const [hintType, setHintType] = useState<"default" | "success" | "error" | "verify">("verify");
	const [hintText, setHintText] = useState("Press Enter to verify");
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Auto-focus when new item appears
	useEffect(() => {
		inputRef.current?.focus();
		setAnswer("");
		setHintType("verify");
		setHintText("Press Enter to verify");
		setIsError(false);
		setIsSuccess(false);
	}, []);

	const checkAnswer = () => {
		if (!currentItem || !answer.trim()) return;

		const userAnswer = answer.trim().toLowerCase();
		const correctAnswer = currentItem.romaji.toLowerCase();

		if (userAnswer === correctAnswer) {
			// Correct Answer
			const randomPhrase =
				motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

			setHintType("success");
			setHintText(randomPhrase);
			setIsSuccess(true);
			setAnswer("");

			// Brief green flash then move to next
			setTimeout(() => {
				setIsSuccess(false);
				onCorrect(); // Ask Display to load next character
			}, 650);
		} else {
			// Wrong Answer
			setIsError(true);
			setHintType("error");
			setHintText("Try again");
			setAnswer("");

			// Reset error animation + hint
			setTimeout(() => {
				setIsError(false);
				setHintType("verify");
				setHintText("Press Enter to verify");
			}, 900);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			checkAnswer();
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
				className={`w-full outline-none focus-visible:ring-0 text-center text-3xl py-5 border-b-4 transition-all duration-200 focus:outline-none
					${
						isError
							? "border-destructive  "
							: isSuccess
								? "border-chart-1  "
								: "border-gray-300 focus:accent "
					}`}
				placeholder="romaji..."
				autoComplete="off"
				spellCheck={false}
			/>
			<div className="mt-5 h-5 text-gray-500 text-sm">
			{hintType === "verify" && (
				<>
				Press <Kbd>Enter</Kbd> to verify
				</>
			)}
			{hintType === "success" && hintText}
			{hintType === "error" && hintText}
			</div>
		</div>
	);
}