# JLPT-aligned kanji curriculum plan

## Goal and wording

Let a learner choose a target from N5 (beginner) through N1 (advanced), either **Through N3** (N5 + N4 + N3) or **N3 only**, and see exactly which kanji and practice prompts are in scope. Keep Hiragana and Katakana independently selectable. Use “JLPT-aligned” rather than “required to pass”: the JLPT publishes no official post-2010 kanji/vocabulary list, and kanji drills alone do not cover grammar, reading comprehension, or listening. See the [official FAQ](https://www.jlpt.jp/e/faq/index.html#anchor28) and [test sections](https://www.jlpt.jp/e/guideline/testsections.html).

## Starting point and current progress

- The pre-existing `src/data/kanji.json` contains 140 unique characters with one romaji answer each and no level metadata. Against the unofficial [KanjiAPI JLPT groupings](https://github.com/onlyskin/kanjiapi.dev), 67 are tagged N5, 52 N4, 12 N3, 8 N2, and 1 N1. These are source-dependent estimates, not official JLPT requirements.
- `src/data/index.ts` contains the legacy script data; `src/data/practice-pool.ts` composes kana, curated readings, or level-filtered recognition prompts. `src/App.tsx` owns selection, question, timer, answered count, and streak. The reference stays searchable across the complete set, independent of practice settings.
- `src/components/Input.tsx` still accepts exactly one romanized reading for legacy kana/curated kanji questions, and accepts documented English glosses for the new recognition questions. Dictionary readings stay reference metadata: do not automatically turn a kanji's first reading into a supposedly unique answer.
- The offline generated `src/data/jlpt/curriculum.json` now contains **2,211** metadata entries: N5 **79**, N4 **166**, N3 **367**, N2 **367**, N1 **1,232**. It joins pinned EDRDG KANJIDIC2 meanings/readings to unofficial KanjiAPI/Tanos level assignments; see [Data Sources](DATA_SOURCES.md). The app uses typed English dictionary-gloss recognition for this set; contextual reading and vocabulary prompts still need review. The published 1.1.0 binary is unchanged.

## Ordered work

### 1. Source and rights gate

- [x] Pin the offline KANJIDIC2 and KanjiAPI/Tanos level source files by checksum, and document origin, rights, transformations and regeneration in [Data Sources](DATA_SOURCES.md).
- [x] Put EDRDG, KanjiAPI and Tanos attribution and licence links in the in-app reference source panel, with full provenance in [Data Sources](DATA_SOURCES.md). Keep code's MIT licence distinct from CC BY-SA 4.0 adapted dictionary metadata.
- Inspect the source's coverage and level semantics. Never infer a missing level; record `null` and keep unclassified entries outside level-specific practice until reviewed.
- Reject data whose redistribution terms cannot be satisfied. No runtime network dependency for desktop practice.

**Done when:** attribution is shipped, the import is reproducible, and the level counts match the chosen source snapshot.

### 2. Model and generated corpus

- Introduce `JLPTLevel = 1 | 2 | 3 | 4 | 5` and separate character metadata (`kanji`, `jlptLevel`, meanings, dictionary readings) from practice prompts (`display`, accepted answers, question type, provenance). Give every prompt a stable ID.
- [x] Generate level-tagged metadata once for all 2,211 mapped N5–N1 kanji without duplicating a character. The generator checks bundled source hashes and rejects missing dictionary entries/English meanings and duplicate level assignments.
- [x] Preserve the existing 140 reading questions as a separate curated-romaji mode; do not promote them to complete level coverage.
- [x] Give every imported character a typed **English dictionary-gloss recognition** exercise, accepting each of its listed English meanings. Never auto-grade context-free dictionary readings as romaji; expand contextual reading/word prompts in reviewed batches. Audit ambiguous glosses and old okurigana-dependent reading prompts before a future release.

**Done when:** every eligible level character appears exactly once in the reference and has a valid practice route; generated records validate deterministically; source attribution and licenses accompany the corpus.

### 3. Filtering and progress rules (tests first)

- Implement pure pool helpers for selected level and scope. `through` includes levels numerically **greater than or equal to** the chosen one (`N3` includes N5/N4/N3); `level-only` includes exactly that level. Unknown-level entries remain separate.
- [x] Filter meaning-practice prompts and count from the same pool; keep the **default reference unrestricted and searchable** rather than silently shrinking it. Kana toggles remain independent, and each available kanji scope has a nonempty pool. Keep the no-immediate-repeat behavior where possible.
- [x] Persist level/scope/mode locally; initial practice remains Hiragana as before, and first-time kanji selection defaults to the legacy curated-reading mode (meaning mode starts at N5 + `through`). Do not equate a single right answer with mastery. Use glyph + question type as the future prompt identity, not an array index.

**Done when:** tests cover each scope, cumulative boundaries, unknown levels, counts, and a filter change during delayed answer advancement. Pure filter/count tests pass; a local Firefox WebDriver run also exercised N5/N3/N1 scopes, correct-answer credit, a quick Reference/Practice round-trip, full-library search and the source panel. Automated timer-specific interaction tests remain a future quality gate.

### 4. UI and study flow

- Add a clearly labeled level selector and `Through this level` / `This level only` control beside the existing script controls. Show pool size and a short disclaimer that levels are approximate. Maintain keyboard navigation, focus, and accessible labels.
- [x] Keep the reference explicitly **all levels** with level badges, meanings, readings, search and a “Show more” button; do not silently apply the practice scope to it.
- On filter changes, cancel pending auto-advance and move to a valid new prompt without resetting earned credit. Ensure hints and skips still work for both reading and recognition prompts.

**Done when:** a learner can switch N5 → N3 → N1 and between cumulative/exact sets without stale questions, broken focus, or a blank practice card.

### 5. Quality gates and rollout

- Validate Unicode, duplicate IDs/glyphs, level distribution and all accepted answers. Spot-check readings and meanings against dictionary entries, prioritizing confusing and okurigana-dependent cases.
- Run focused tests, complete Bun suite, Biome, TypeScript/Vite build, and native Tauri/Nix checks if packaging changes. Exercise the UI at small and normal window sizes and verify switching scope mid-question.
- Keep the README and attribution aligned with **actually available** modes. Packaging or release of the new curriculum remains separate work; the already-published 1.1.0 binary remains unchanged until a subsequent release is explicitly requested.

**Done when:** the checked-in corpus, tests, app build, and manual interaction agree on counts and behavior; distinguish completed study features from the still-unimplemented spaced repetition and JLPT readiness assessment.
