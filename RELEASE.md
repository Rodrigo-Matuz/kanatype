# KanataType 1.1.0

KanataType has a redesigned practice experience for learning Japanese kana and kanji. Downloads for Windows and x86_64 Linux are attached to this release.

## What changed

- **A clearer practice screen.** Choose Hiragana, Katakana, Kanji, or a combination. The current script is shown on each prompt, and the layout adapts to smaller windows.
- **Better feedback as you practice.** See whether an answer is correct, reveal a hint, or skip a character. Track answered prompts and your current streak; a correct answer counts immediately, while a wrong answer or skip resets the streak. The next prompt avoids repeating the same character when possible.
- **A searchable reference.** Browse all three scripts and find characters by their glyph, romaji, or (for kanji) English meaning.
- **A more comfortable desktop interface.** Switch between light and dark themes, use the custom window controls, and navigate between practice and the reference without losing the app window.
- **Reading corrections.** Fixed several kanji answers that previously used the reading of a different character or an entire word rather than the displayed kanji.
- **KanataType branding.** The app name and package description now identify KanataType instead of the generic “A Tauri App.” The `kanatype` executable remains available.
- **Opt-in Nix/Home Manager installation.** The repository now provides a flake and a `programs.kanatype.enable` Home Manager module for x86_64 Linux. Import and enable the module explicitly; it is not installed automatically. See [the README](https://github.com/Rodrigo-Matuz/kanatype#nixos--home-manager-x86_64-linux) for setup instructions.

## Installation

Download the Windows installer or x86_64 Linux `.deb` attached to this release. Nix users can also use the repository flake once its pinned package has been updated to this release. Existing Windows MSI installations retain the same upgrade identity.

For changes since 1.0.0, see the [comparison](https://github.com/Rodrigo-Matuz/kanatype/compare/1.0.0...v1.1.0).
