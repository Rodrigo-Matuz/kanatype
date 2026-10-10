# KanataType

A clean, focused desktop app for learning and practicing Japanese kana (Hiragana & Katakana) and Kanji.

Built with **Tauri** for a lightweight, native-feeling experience.

---

## Preview

![KanataType practice screen](assets/preview.png)

---

## Features

- **Multiple Script Modes**: Practice Hiragana, Katakana, Kanji — individually or combined
- **Smart Filtering**: Toggle any combination of scripts (always at least one active)
- **Interactive Learning**: Type the reading, reveal a hint, or skip to the next character; practice counts and streaks update as you go
- **Reference Table**: Search kana and kanji by character, romaji, or meaning
- **Dark/Light Theme**: Built-in theme switcher that follows the system by default
- **Responsive UI**: Keyboard-accessible React + TypeScript interface

---

## Technologies

This application is built with **Tauri 2** — a secure and lightweight framework for desktop applications.

- **Backend**: Rust  
  High performance, memory safety, and native system integration
- **Frontend**: React + TypeScript + Vite  
  Modern, type-safe, and fast development experience

---

## Installation

### From Releases (Recommended)

Go to the [Releases](https://github.com/Rodrigo-Matuz/kanatype/releases/) page and download the latest version for your operating system.

### NixOS / Home Manager (x86_64 Linux)

Add the input to your existing `flake.nix`:

```nix
inputs.kanatype.url = "github:Rodrigo-Matuz/kanatype";
```

Then import and enable its module in your Home Manager configuration:

```nix
{ inputs, ... }: {
  imports = [ inputs.kanatype.homeManagerModules.default ];
  programs.kanatype.enable = true;
}
```

For a standalone Home Manager flake, pass `inputs` with
`home-manager.lib.homeManagerConfiguration { extraSpecialArgs = { inherit inputs; }; ... }`.
For NixOS with Home Manager as a module, set
`home-manager.extraSpecialArgs = { inherit inputs; };` instead.
Then apply your usual Home Manager or NixOS configuration. The package installs
`kanatype` and a desktop launcher. Alternatively, install just the package with
`nix profile install github:Rodrigo-Matuz/kanatype` (do not install it both ways).

The flake currently packages the **1.0.0** Linux `.deb` release for x86_64;
it relabels the launcher as KanataType with the new description, but the app
inside is still the 1.0.0 build. The interface changes in this repository will
only reach Nix users after a new release is built and the version and verified
hash in `flake.nix` are updated. The flake is not a build of your local working
tree.

### Build from Source

<details>
<summary>Build instructions</summary>

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rodrigo-Matuz/kanatype.git
   cd kanatype
   ```

2. **Install frontend dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Build the desktop app**

   ```bash
   bun run tauri build
   # or
   npm run tauri build
   ```

The built executable will be available in:

```
src-tauri/target/release/
```

</details>

---

## Run Locally (Browser Mode)

<details>
<summary>Start the browser preview</summary>

If you don’t want to build the desktop app, you can run it directly in your browser for development:

```bash
bun run dev
# or
npm run dev
```

Then open:

```
http://localhost:1420 (most likely)
```

This mode is ideal for faster development and testing UI changes.

Run the frontend checks with `bun test` and `bun run build`.
</details>

---

## Permissions & Security

KanataType follows **Tauri 2**'s strict capability-based permission model and only requests the minimum permissions needed.

You can inspect all permissions in:
```json
src-tauri/capabilities/default.json
```

---

## Customizing Datasets

You can easily modify the character datasets (Hiragana, Katakana, and Kanji) to suit your learning needs.

For detailed information about the current datasets and how to customize them, see:

→ **[src/data/README.md](src/data/README.md)**

This document includes explanations about small characters, yōon combinations, design decisions, and instructions for adding or removing characters.

---

## TODO

- [ ] **Settings Page**
  - Themes and user preferences
  - In-app dataset editor (modify characters, add custom entries, etc.)

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for:

- New features
- Additional Kanji levels / JLPT support
- Bug fixes
- UI/UX improvements
- Translations

---

## Support the Project

If you find **KanataType** useful and want to support its development, consider [sponsoring me on Ko-fi](https://ko-fi.com/matuz).

Any amount is greatly appreciated!

---

## About

A simple and effective tool to help you learn Japanese characters.

Made with ❤️ by [Rodrigo Matuz](https://matuz.me)

---

**License**: MIT
