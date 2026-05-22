### Why small tsu (っ) and small vowels (ぁ ぃ ぅ ぇ ぉ) are **not included**

I intentionally chose not to include:
- `っ` (small tsu / sokuon)
- `ぁ ぃ ぅ ぇ ぉ` (small vowels)

### Reasons for exclusion:

- They function as **modifiers** rather than standalone characters, so they require different handling in code.
- They look very similar to their full-sized versions, which can cause confusion for learners.
- They appear much less frequently than basic hiragana and yōon combinations.
- Keeping the JSON clean, simple, and beginner-friendly was a priority.

### When and why you should add them:

**Small tsu (っ)**  
- Used to double consonants (e.g. `katta` → かった, `ippai` → いっぱい, `massugu` → まっすぐ).  
- Extremely common in everyday Japanese.  
- **How to add:** Append this to your `hiragana.json`:
  ```json
  { "romaji": "small tsu", "kana": "っ" }
  ```

**Small vowels (ぁ ぃ ぅ ぇ ぉ)**  
- Used for special readings, emphasis, or phonetic adjustments (especially in names and loanwords).  
- More common in katakana, but they also appear in hiragana occasionally.  
- **How to add:** Append these to your `hiragana.json`:
  ```json
  { "romaji": "small a", "kana": "ぁ" },
  { "romaji": "small i", "kana": "ぃ" },
  { "romaji": "small u", "kana": "ぅ" },
  { "romaji": "small e", "kana": "ぇ" },
  { "romaji": "small o", "kana": "ぉ" }
  ```
