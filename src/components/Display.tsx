import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";

import { getDataByTypes } from "@/data";

import type {
	DisplayHandle,
	DisplayProps,
	JapaneseItem,
	KanaItem,
	KanjiItem,
	ScriptType,
} from "@/types";

type Props = DisplayProps & {
	/**
	 * Active script filters currently enabled in the app
	 */
	scriptTypes: ScriptType[];
};

/**
 * Display component
 *
 * Responsibilities:
 * - Shows the current Japanese character
 * - Randomly selects the next item
 * - Exposes "next()" through React refs
 */
const Display = forwardRef<DisplayHandle, Props>(
	({ onChange, scriptTypes }, ref) => {
		/**
		 * Initial random item shown when component mounts
		 */
		const [current, setCurrent] = useState<JapaneseItem>(() => {
			const data = getDataByTypes(scriptTypes);

			return data[Math.floor(Math.random() * data.length)];
		});

		/**
		 * Selects a new random item
		 */
		const next = () => {
			const data = getDataByTypes(scriptTypes);

			const newItem =
				data[Math.floor(Math.random() * data.length)];

			setCurrent(newItem);

			// Notify parent component
			onChange?.(newItem);
		};

		/**
		 * Expose imperative API to parent through ref
		 */
		useImperativeHandle(ref, () => ({
			next,
		}));

		/**
		 * Notify parent whenever current item changes
		 */
		useEffect(() => {
			onChange?.(current);
		}, [current, onChange]);

		/**
		 * Determine which character should be rendered.
		 *
		 * Kana items use:
		 * - current.kana
		 *
		 * Kanji items use:
		 * - current.kanji
		 */
		const displayCharacter = 
		current.type === "kanji" 
			? (current as KanjiItem).kanji 
			: (current as KanaItem).kana;

		return (
			<div className="flex flex-col justify-center items-center h-[40vh]">
				<div className="font-bold text-[15rem] select-none">
					{displayCharacter}
				</div>
			</div>
		);
	}
);

Display.displayName = "Display";

export default Display;