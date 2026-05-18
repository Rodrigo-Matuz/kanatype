export interface HiraganaItem {
  romaji: string;
  kana: string;
  meaning?: string;   // useful for kanji later
}

export interface DisplayHandle {
  next: () => void;
}

export interface DisplayProps {
  onChange?: (item: HiraganaItem) => void;
}