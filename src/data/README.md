### Why small vowels (ぁ ぃ ぅ ぇ ぉ) are **not included**

I intentionally chose **not** to include the small vowels (`ぁ ぃ ぅ ぇ ぉ`).

However, **small tsu (っ)** *is* included in this JSON because it is by far the most commonly used small character in Japanese.

### Reasons for excluding small vowels:

- They look very similar to their full-sized versions, which can cause confusion for beginners.
- They appear much less frequently than basic hiragana and yōon combinations.
- Keeping the JSON clean and focused was a priority.

### Note about small tsu (っ)

- **Included** because it is extremely common in real Japanese.
- Used to create double consonants (e.g. `katta` → かった, `ippai` → いっぱい, `massugu` → まっすぐ).
- This is the **only** small version added in this dataset.

### How to add small vowels (if you need them)

If you want full coverage, you can append these to `hiragana.json`:

```json
{ "romaji": "small a", "kana": "ぁ" },
{ "romaji": "small i", "kana": "ぃ" },
{ "romaji": "small u", "kana": "ぅ" },
{ "romaji": "small e", "kana": "ぇ" },
{ "romaji": "small o", "kana": "ぉ" }