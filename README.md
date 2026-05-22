# Kanatype

A clean, focused desktop app for learning and practicing Japanese kana (Hiragana & Katakana) and Kanji.

Built with **Tauri** for a lightweight, native-feeling experience.

---

## Preview

<img width="5000" height="2800" alt="KataType App Dark and White mode" src="https://github.com/user-attachments/assets/5e7cf232-708c-4c80-a640-87b43864d1da" />

---

## Features

- **Multiple Script Modes**: Practice Hiragana, Katakana, Kanji — individually or combined
- **Smart Filtering**: Toggle any combination of scripts (always at least one active)
- **Interactive Learning**: Character display + input component with instant feedback
- **Reference Table**: Quick-access kana/kanji table view
- **Dark/Light Theme**: Built-in theme switcher with smooth transitions
- **Responsive & Clean UI**: Modern React + TypeScript frontend

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

Go to the [Releases](../../releases) page and download the latest version for your operating system.

### Build from Source

<details>
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
</details>

---

## Permissions & Security

Kanatype follows **Tauri 2**'s strict capability-based permission model and only requests the minimum permissions needed.

You can inspect all permissions in:
```json
src-tauri/capabilities/permissions.json
```

---

## Customizing Datasets

You can easily modify the character datasets (Hiragana, Katakana, and Kanji) to suit your learning needs.

For detailed information about the current datasets and how to customize them, see:

→ **[src/data/README.md](https://github.com/Rodrigo-Matuz/kanatype/blob/main/src/data)**

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

If you find **Kanatype** useful and want to support its development, consider [sponsoring me on Ko-fi](https://ko-fi.com/matuz).

Any amount is greatly appreciated!

---

## About

A simple and effective tool to help you learn Japanese characters.

Made with ❤️ by [Rodrigo Matuz](https://matuz.me)

---

**License**: MIT
