import { ArrowRight, Eye, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getLocalizedMeanings } from "@/data/jlpt/meanings";
import { useLanguage } from "@/i18n/LanguageProvider";
import { isCorrectAnswer } from "@/lib/jlpt/answers";
import { normalizeAnswer } from "@/lib/practice";
import type { JapaneseItem } from "@/types";

type Props = {
	currentItem: JapaneseItem;
	onCorrect: () => void;
	onSkip: () => void;
	onWrong: () => void;
};

export default function Input({ currentItem, onCorrect, onSkip, onWrong }: Props) {
	const { language, t } = useLanguage();
	const meaningQuestion = currentItem.type === "kanji" && currentItem.question === "meaning";
	const meanings = getLocalizedMeanings(currentItem, language);
	let hint: string;
	if (currentItem.type === "kanji" && currentItem.question === "meaning") {
		hint = meanings?.length
			? t("answer.hint.meanings", { meanings: meanings.join(", ") })
			: t("reference.meaningMissing");
	} else {
		hint =
			currentItem.type === "kanji" && meanings?.length
				? t("answer.hint.readingMeaning", {
						reading: currentItem.romaji,
						meaning: meanings.join(", "),
					})
				: t("answer.hint.reading", { reading: currentItem.romaji });
	}
	const [answer, setAnswer] = useState("");
	const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
	const [showHint, setShowHint] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const answered = useRef(false);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	function checkAnswer(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!normalizeAnswer(answer) || answered.current) return;

		if (isCorrectAnswer(answer, currentItem, language)) {
			answered.current = true;
			setFeedback("correct");
			onCorrect();
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
					{t("answer.label")}{" "}
					<span>
						·{" "}
						{meaningQuestion
							? t(language === "pt-BR" ? "answer.meaningPt" : "answer.meaning")
							: t("answer.romaji")}
					</span>
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
						placeholder={t(
							meaningQuestion
								? "answer.placeholder.meaning"
								: "answer.placeholder.reading",
						)}
						autoComplete="off"
						spellCheck={false}
						autoCapitalize="off"
						aria-describedby="answer-feedback"
						disabled={feedback === "correct"}
					/>
					<Button type="submit" disabled={!answer.trim() || feedback === "correct"}>
						{t("answer.check")} <ArrowRight aria-hidden="true" size={16} />
					</Button>
				</div>
			</form>
			<div className="answer-meta">
				<output id="answer-feedback" aria-live="polite">
					{feedback === "correct"
						? t("answer.feedback.correct")
						: feedback === "wrong"
							? t("answer.feedback.wrong")
							: showHint
								? hint
								: t("answer.feedback.idle")}
				</output>
				<div className="answer-actions">
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={() => {
							setShowHint(true);
							setFeedback("idle");
							inputRef.current?.focus();
						}}
						disabled={feedback === "correct"}
					>
						<Eye aria-hidden="true" size={16} /> {t("answer.hint")}
					</Button>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={onSkip}
						disabled={feedback === "correct"}
					>
						<SkipForward aria-hidden="true" size={16} /> {t("answer.skip")}
					</Button>
				</div>
			</div>
		</div>
	);
}
