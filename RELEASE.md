# KanataType 1.2.0

Practice an expanded, offline kanji curriculum with selectable JLPT-aligned study levels. Windows MSI and x86_64 Linux `.deb` installers are attached to this release.

## What changed since 1.1.0

- **Five unofficial kanji study levels.** The bundled reference contains 2,211 kanji: N5 (79), N4 (166), N3 (367), N2 (367), and N1 (1,232). These community-sourced sets are **not official JLPT requirements or an exam-readiness guarantee**.
- **Choose your practice coverage.** Practice kanji from one exact level or cumulatively through a level (for example, “Through N3” includes N5, N4, and N3). The screen shows the number of available prompts. Hiragana and Katakana choices remain independent of the kanji level filter.
- **Two distinct kanji exercises.** Keep the original 140 curated romaji-reading prompts, or switch to recognition questions that ask for an English meaning from the new curriculum. The meaning exercise accepts documented dictionary glosses, including sensible shortened glosses without a trailing parenthetical qualifier; dictionary readings are **not** treated as uniquely correct isolated-character answers. Existing answer feedback, hints, scoring, and delayed advancement remain available.
- **Full searchable reference.** Browse all levels regardless of the current practice filter. Search by character, Japanese dictionary reading, English meaning, or level. The app displays on/kun readings and makes the dataset attribution and licensing readable inside the offline application.
- **Reproducible source data.** The repo includes pinned source snapshots, a deterministic generator, and [data provenance and licence details](https://github.com/Rodrigo-Matuz/kanatype/blob/main/docs/DATA_SOURCES.md). Character meanings and readings are adapted from EDRDG KANJIDIC2 (CC BY-SA 4.0); level assignments are credited to KanjiAPI and Tanos (CC BY, version unspecified). The code and adapted dictionary data have separate licences.

## Installation

Download the Windows `.msi` or x86_64 Linux `.deb` below. The executable remains `kanatype`, and existing Windows MSI installations retain the same upgrade identity. Nix/Home Manager installation remains opt-in via `programs.kanatype.enable`; the `main` flake package is repinned to this release after the installers are published and their hashes verified.

[Compare v1.1.0 to v1.2.0](https://github.com/Rodrigo-Matuz/kanatype/compare/v1.1.0...v1.2.0).
