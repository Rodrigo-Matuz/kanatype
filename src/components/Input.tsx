import { ArrowRight, Eye, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { normalizeAnswer } from "@/lib/practice";
import type { JapaneseItem } from "@/types";

type Props = {
	currentItem: JapaneseItem;
	onCorrect: () => void;
	onSkip: () => void;
	onWrong: () => void;
};

export default function Input({ currentItem, onCorrect, onSkip, onWrong }: Props) {
	const [answer, setAnswer] = useState("");
	const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
	const [showHint, setShowHint] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		inputRef.current?.focus();
		return () => {
			if (timerRef.current !== null) clearTimeout(timerRef.current);
		};
	}, []);

	function checkAnswer(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!normalizeAnswer(answer) || feedback === "correct") return;

		if (normalizeAnswer(answer) === normalizeAnswer(currentItem.romaji)) {
			setFeedback("correct");
			timerRef.current = setTimeout(onCorrect, 550);
		} else {
			setFeedback("wrong");
			onWrong();
			setAnswer("");
			inputRef.current?.focus();
		}
	}

	return (
		<div className="answer-area">
			<form onSubmit={checkAnswer} className="answer-form">
				<label htmlFor="romaji-answer" className="answer-label">
					Your answer <span>· ROMAJI</span>
				</label>
				<div
					className={`answer-control ${feedback === "wrong" ? "answer-wrong" : ""} ${feedback === "correct" ? "answer-correct" : ""}`}
				>
					<input
						id="romaji-answer"
						ref={inputRef}
						type="text"
						value={answer}
						onChange={(event) => {
							setAnswer(event.target.value);
							if (feedback === "wrong") setFeedback("idle");
						}}
						placeholder="Type the reading…"
						autoComplete="off"
						spellCheck={false}
						autoCapitalize="off"
						aria-describedby="answer-feedback"
						disabled={feedback === "correct"}
					/>
					<Button type="submit" disabled={!answer.trim() || feedback === "correct"}>
						Check <ArrowRight aria-hidden="true" size={16} />
					</Button>
				</div>
			</form>
			<div className="answer-meta">
				<output id="answer-feedback" aria-live="polite">
					{feedback === "correct"
						? "Correct! On to the next character."
						: feedback === "wrong"
							? "Not quite — try again."
							: showHint
								? `Reading: ${currentItem.romaji}${currentItem.type === "kanji" ? ` · ${currentItem.meaning}` : ""}`
								: "Press Enter to check your answer."}
				</output>
				<div className="answer-actions">
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={() => {
							setShowHint(true);
							setFeedback("idle");
						}}
						disabled={feedback === "correct"}
					>
						<Eye aria-hidden="true" size={16} /> Hint
					</Button>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={onSkip}
						disabled={feedback === "correct"}
					>
						<SkipForward aria-hidden="true" size={16} /> Skip
					</Button>
				</div>
			</div>
		</div>
	);
}
