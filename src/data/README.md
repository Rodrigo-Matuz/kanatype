# Hiragana

This JSON contains the complete basic hiragana set, all yōon combinations, and the most commonly used small characters.

### Small characters in this JSON (Hiragana)

This dataset includes:
- `っ` (small tsu)
- `ゃ ゅ ょ` (small ya, yu, yo)

**Small tsu (っ)** and the **small y-sounds (ゃ ゅ ょ)** are the only small characters included.

### Why I included them:

- **`っ` (small tsu)** is extremely common and essential for natural Japanese.  
  It is used to create double consonants (e.g. `katta` → かった, `ippai` → いっぱい, `massugu` → まっすぐ).

- **`ゃ ゅ ょ` (small ya/yu/yo)** are also very important because they are heavily used in **yōon** combinations (e.g. `kya` = きゃ, `shu` = しゅ, `cho` = ちょ, `nya` = にゃ, etc.).  
  While they mostly appear as part of combined sounds, including them as separate entries makes the dataset more complete and useful for learners and developers. (As pointed out by anatom. inc.)

### Why small vowels (ぁ ぃ ぅ ぇ ぉ) are **not included**:

- They function mainly as modifiers for special readings.
- They are used much less frequently than small tsu and small y-sounds in hiragana.
- I chose to keep the JSON clean and focused on the most practical characters.

## How to add small vowels (if you need them)

If you want full coverage, append these to `hiragana.json`:

```json
{ "romaji": "small a", "kana": "ぁ" },
{ "romaji": "small i", "kana": "ぃ" },
{ "romaji": "small u", "kana": "ぅ" },
{ "romaji": "small e", "kana": "ぇ" },
{ "romaji": "small o", "kana": "ぉ" }
```

---

# Katakana

This JSON contains the complete basic katakana set, all yōon combinations, and **all small character variations**.

### Small characters in this JSON (Katakana)

This dataset includes:
- `ッ` (small tsu)
- `ャ ュ ョ` (small ya, yu, yo)
- `ァ ィ ゥ ェ ォ` (small a, i, u, e, o)

### Why everything is included:

- **`ッ` (small tsu)** is essential for double consonants (e.g. `beddo` → ベッド, `kakko` → カッコ).

- **`ャ ュ ョ` (small ya/yu/yo)** are heavily used in yōon combinations (e.g. `kya` = キャ, `shu` = シュ, `cho` = チョ).

- **`ァ ィ ゥ ェ ォ` (small vowels)** are included because they are **very important** in Katakana.  
  They are frequently used when writing foreign words, names, and loanwords (e.g. `violin` → ヴァイオリン, `violet` → ヴィオレット, `cake` → ケーキ, `file` → ファイル).  
  Small vowels are far more common in katakana than in hiragana, which is why they were included here.

### Yōon Combinations

All standard yōon combinations (`kya`, `sha`, `cha`, `nya`, `ja`, etc.) are also included using the correct small characters.

*Thanks to anatom. inc.*

---

### Customization Note

You are completely free to modify this dataset according to your needs.  
Feel free to add any missing characters or remove anything you don’t need.  

> The current selection reflects my personal decisions on what provides the best balance between completeness and simplicity for most learners and developers. Some items were included for high practical usage, while others were excluded to keep the JSON clean and beginner-friendly.


