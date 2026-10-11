# JLPT-aligned curriculum: data sources and attribution

KanataType's generated kanji curriculum is an **unofficial study set**, not a list of kanji required by the JLPT or an official assessment of readiness. The JLPT [does not publish post-2010 test-content specifications or official kanji/vocabulary lists](https://www.jlpt.jp/e/faq/index.html#anchor28). A kanji study set alone does not cover the full test.

## Bundled source snapshots

| Bundled file | Origin and use | SHA-256 (of the bundled file) |
| --- | --- | --- |
| `data/sources/kanjidic2.xml.gz` | [EDRDG KANJIDIC2](https://www.edrdg.org/kanjidic/kanjidic2.xml.gz): kanji literals, English meanings, Japanese on and kun readings | `91a70dff7bb2e4617027574e889c10bf96b907233d682baa4d9cf07e4c626157` |
| `data/sources/jlpt.tsv` | [KanjiAPI `jlpt.tsv` at revision `1f34991bdebdd7ae1a4b0ca05fd2772a3cf21950`](https://github.com/onlyskin/kanjiapi.dev/blob/1f34991bdebdd7ae1a4b0ca05fd2772a3cf21950/jlpt.tsv), based on [Tanos JLPT study lists](http://www.tanos.co.uk/jlpt/): unofficial N5–N1 assignments | `52ff4165bc3bac8d5784c8521c41a2255c0346a580d8f24ab0f259451564ccfe` |

The checksums identify the **bundled snapshots**, not whatever a live upstream download may contain later. No runtime API or network request is needed to read this corpus.

## How the data is adapted

Run `bun scripts/generate-jlpt.ts` from the repository root to regenerate `src/data/jlpt/curriculum.json` from the bundled sources. The generator verifies both checksums, decompresses KANJIDIC2, parses the KanjiAPI level mapping, and joins each level-tagged kanji with its KANJIDIC2 entry. It selects English meanings and Japanese on/kun readings, and writes `kanji`, `jlptLevel`, `meanings`, `onReadings`, and `kunReadings` to JSON. It rejects duplicate level assignments, missing dictionary entries or English meanings, and an unexpected total. The generated corpus contains **2,211 unique kanji**: N5 79, N4 166, N3 367, N2 367, N1 1,232. Kanji without a level in the bundled mapping are not included; no missing level is inferred.

These are **character metadata**, not vetted reading answer keys. The app now offers a typed English-meaning recognition exercise for each mapped character; multiple dictionary glosses are accepted. A dictionary may list multiple context-dependent readings; none is automatically presented as a unique correct romaji reading for an isolated kanji. The pre-existing 140 curated romaji prompts remain a separate mode. The reference library stays searchable across the full dataset, independent of the practice filter; further contextual reading/word prompts require editorial review (see [the plan](JLPT_PLAN.md)).

## Rights and credits

- **Dictionary:** KANJIDIC2 is maintained by the [Electronic Dictionary Research and Development Group (EDRDG)](https://www.edrdg.org/edrdg/licence.html), with copyright held by James William Breen and EDRDG and additional contributors acknowledged in its [dictionary licence statement](https://www.edrdg.org/edrdg/licence.html). It is licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/). See the [EDRDG licence and attribution requirements](https://www.edrdg.org/edrdg/licence.html), including the KANJIDIC2-specific contributor conditions. We extract selected fields, filter and join entries, and reformat them as JSON; this is adapted dictionary metadata, not original KanataType authorship.
- **Level assignments:** Credit [KanjiAPI](https://github.com/onlyskin/kanjiapi.dev) for the pinned `jlpt.tsv` compilation and [Tanos JLPT resources](http://www.tanos.co.uk/jlpt/) for the underlying lists. The [archived Tanos sharing policy](https://web.archive.org/web/20251114165345id_/https://www.tanos.co.uk/jlpt/sharing/) describes a **Creative Commons BY** licence without specifying a version; it permits commercial and noncommercial reuse with credit to the site. Do not silently treat it as a versioned CC BY licence or as an official JLPT list.
- **Resulting metadata:** The KANJIDIC2-derived portions of `src/data/jlpt/curriculum.json` are adapted material made available under **CC BY-SA 4.0**, subject to its attribution and share-alike conditions; acknowledge **both** EDRDG/KANJIDIC2 and KanjiAPI/Tanos when redistributing the combined corpus. Link to this notice, the [EDRDG licence](https://www.edrdg.org/edrdg/licence.html) and the [CC BY-SA 4.0 licence](https://creativecommons.org/licenses/by-sa/4.0/) with distributed data. No upstream party endorses KanataType.
- **Software:** KanataType's application **code** is separately licensed under [MIT](../LICENSE). That code licence does **not** replace the source-data notices or grant MIT rights to the adapted dictionary metadata.

The original XML is preserved as the bundled compressed source; regeneration changes selection, combination and format, not the upstream originals. When shipping an app build, ensure these credits and licence links remain accessible with the distributed metadata; a README-only credit is not a substitute for any acknowledgement required in the app or its packaged documentation.
