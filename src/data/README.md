### Small characters in this JSON

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

- They function mainly as **modifiers** for special readings (especially in katakana loanwords).
- They are used much less frequently than small tsu and small y-sounds.
- They look very similar to their normal-sized versions, which can be confusing.
- I wanted to keep the JSON clean and focused on the most practical characters, but you can add them if you want

### How to add small vowels (if you need them later)

If you want full coverage, append these to `hiragana.json`:

```json
{ "romaji": "small a", "kana": "ぁ" },
{ "romaji": "small i", "kana": "ぃ" },
{ "romaji": "small u", "kana": "ぅ" },
{ "romaji": "small e", "kana": "ぇ" },
{ "romaji": "small o", "kana": "ぉ" }