import japaneseData from './japanese.json';

export type ScriptType = 'hiragana' | 'katakana' | 'kanji';

export const getDataByTypes = (types: ScriptType[]): any[] => {
  if (types.length === 0) return japaneseData.hiragana;

  const sets: any[] = [];
  
  if (types.includes('hiragana')) sets.push(...japaneseData.hiragana);
  if (types.includes('katakana')) sets.push(...japaneseData.katakana);
  if (types.includes('kanji')) sets.push(...japaneseData.kanji);

  return sets;
};