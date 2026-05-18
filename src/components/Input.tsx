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
	/**
	 * Current learning item shown in Display component
	 *
	 * Used to validate user input against the correct romaji answer.
	 */
	currentItem: JapaneseItem | null;

	/**
	 * Called after user submits a correct answer
	 *
	 * Parent component usually uses this to:
	 * - load next character
	 * - advance learning session
	 */
	onCorrect: () => void;
};

/**
 * Input component
 *
 * Responsibilities:
 * - Capture user answer
 * - Validate answer against current item
 * - Display success/error feedback
 * - Trigger next item on success
 */
export default function Input({
	currentItem,
	onCorrect,
}: Props) {
	/**
	 * Current text typed by the user
	 */
	const [answer, setAnswer] = useState("");

	/**
	 * Current visual state of the hint area
	 *
	 * verify → waiting for Enter
	 * success → correct answer feedback
	 * error → incorrect answer feedback
	 */
	const [hintType, setHintType] = useState<
		"default" | "success" | "error" | "verify"
	>("verify");

	/**
	 * Text currently displayed below the input
	 */
	const [hintText, setHintText] =
		useState("Press Enter to verify");

	/**
	 * Controls error animation / styling
	 */
	const [isError, setIsError] = useState(false);

	/**
	 * Controls success animation / styling
	 */
	const [isSuccess, setIsSuccess] = useState(false);

	/**
	 * Reference to actual HTML input element
	 *
	 * Used for automatic focus management.
	 */
	const inputRef = useRef<HTMLInputElement>(null);

	/**
	 * Runs when component first mounts.
	 *
	 * Responsibilities:
	 * - auto-focus input
	 * - reset UI state
	 * - clear previous answer
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
	 * Validates current user answer
	 */
	const checkAnswer = () => {
		/**
		 * Prevent validation if:
		 * - no current item exists
		 * - input is empty
		 */
		if (!currentItem || !answer.trim()) {
			return;
		}

		/**
		 * Normalize input for safer comparison
		 *
		 * Example:
		 * " KA " → "ka"
		 */
		const userAnswer =
			answer.trim().toLowerCase();

		const correctAnswer =
			currentItem.romaji.toLowerCase();

		/**
		 * Correct Answer
		 */
		if (userAnswer === correctAnswer) {
			/**
			 * Random success feedback message
			 */
			const randomPhrase =
				motivationalPhrases[
					Math.floor(
						Math.random() *
							motivationalPhrases.length
					)
				];

			setHintType("success");
			setHintText(randomPhrase);

			setIsSuccess(true);

			// Clear input field immediately
			setAnswer("");

			/**
			 * Short success animation before moving forward
			 */
			setTimeout(() => {
				setIsSuccess(false);

				// Notify parent component
				onCorrect();
			}, 650);
		} else {
			/**
			 * Wrong Answer
			 */
			setIsError(true);

			setHintType("error");
			setHintText("Try again");

			// Clear incorrect input
			setAnswer("");

			/**
			 * Reset error UI after short delay
			 */
			setTimeout(() => {
				setIsError(false);

				setHintType("verify");
				setHintText("Press Enter to verify");
			}, 900);
		}
	};

	/**
	 * Handles keyboard input events
	 */
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		/**
		 * Submit answer when Enter key is pressed
		 */
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
				onChange={(e) =>
					setAnswer(e.target.value)
				}
				onKeyDown={handleKeyDown}
				/**
				 * Dynamic border styling:
				 *
				 * - red   → wrong answer
				 * - green → correct answer
				 * - gray  → default state
				 */
				className={`w-full outline-none focus-visible:ring-0 text-center text-3xl py-5 border-b-4 transition-all duration-200 focus:outline-none
					${
						isError
							? "border-destructive"
							: isSuccess
								? "border-chart-1"
								: "border-gray-300 focus:accent"
					}`}
				placeholder="romaji..."
				autoComplete="off"
				spellCheck={false}
			/>

			{/* Hint / feedback area */}
			<div className="mt-5 h-5 text-gray-500 text-sm">
				{hintType === "verify" && (
					<>
						Press <Kbd>Enter</Kbd> to verify
					</>
				)}

				{hintType === "success" &&
					hintText}

				{hintType === "error" &&
					hintText}
			</div>
		</div>
	);
}