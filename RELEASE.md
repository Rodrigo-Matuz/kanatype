# KanataType 1.3.0

Practice KanataType in Brazilian Portuguese or English. Windows MSI and x86_64 Linux `.deb` installers are attached to this release.

## What changed since 1.2.0

- **App language selector.** Switch between English and Brazilian Portuguese from practice or the reference. The choice is saved, and interface copy and accessibility labels come from matching JSON catalogs so contributors can add translations.
- **Portuguese meaning practice.** Questions and accepted meaning answers follow the selected language. The bundled KANJIDIC2 snapshot provides Portuguese glosses for **1,929** of the 2,211 unofficial JLPT-aligned study kanji. The other **282** N1 kanji remain in the reference, marked untranslated; they are not asked as Portuguese meaning questions or graded against English glosses. Existing hiragana, katakana, and 140 curated romaji-reading questions remain available in both languages.
- **Language-aware reference and search.** Glosses, controls and search results follow the selected language. Portuguese search does not silently match untranslated English meanings; kanji, Japanese readings, level labels and curated romaji remain searchable. Meaning answers and meaning search ignore accents, while romaji grading stays strict.
- **Safe language changes during practice.** Switching languages reconciles the active question without counting an answer twice or accepting an old-language answer. Credited answers still advance after the normal delay.
- **Offline, attributed data.** The Portuguese gloss JSON is reproducibly extracted from the pinned EDRDG KANJIDIC2 snapshot. The [source, coverage, adaptation and licensing notes](https://github.com/Rodrigo-Matuz/kanatype/blob/v1.3.0/docs/DATA_SOURCES.md) distinguish the dictionary's CC BY-SA 4.0 data licence from the software's MIT licence. These N5–N1 groups are community study sets, **not official JLPT requirements**.

## Installation

Download the Windows `.msi` or x86_64 Linux `.deb` below. The executable and Windows upgrade identity remain `kanatype`. The Nix/Home Manager flake is opt-in; its release-pinned Linux package is updated on `main` only after the new `.deb` is published and its hash verified. Until then, the flake still installs the 1.2.0 binary.

[Compare v1.2.0 to v1.3.0](https://github.com/Rodrigo-Matuz/kanatype/compare/v1.2.0...v1.3.0).
