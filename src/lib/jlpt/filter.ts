export type JLPTLevel = 1 | 2 | 3 | 4 | 5;
export type JLPTScope = "through" | "exact";

export function filterKanjiByLevel<T extends { jlptLevel: JLPTLevel | null }>(
	items: readonly T[],
	level: JLPTLevel,
	scope: JLPTScope,
): T[] {
	return items.filter(
		(item) =>
			item.jlptLevel !== null &&
			(scope === "exact" ? item.jlptLevel === level : item.jlptLevel >= level),
	);
}
