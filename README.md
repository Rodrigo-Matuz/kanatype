# Kanatype

A clean, focused desktop app for learning and practicing Japanese kana (Hiragana & Katakana) and Kanji.

Built with **Tauri** for a lightweight, native-feeling experience.

---

## Preview

*(Add screenshots/GIFs here once you have them)*

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

## Dependencies

- **Tauri** (v2)
- **React** + **TypeScript**
- **Vite** (build tool)
- **Lucide React** (icons)
- **next-themes** (theme management)

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
http://localhost:5173
```

This mode is ideal for:

* Faster development
* Testing UI changes instantly
* Running without Tauri/desktop build overhead
</details>

---

## Permissions & Security

Kanatype follows **Tauri 2**'s strict capability-based permission model and only requests the minimum permissions needed.

You can inspect all permissions in:
```json
src-tauri/capabilities/permissions.json
```

---

## Project Structure

```
kanatype/
├── src/                    # React + TypeScript frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main views (Learn, Table)
│   ├── data/               # Character datasets
│   └── lib/                # Utilities
├── src-tauri/              # Rust backend
│   ├── src/
│   └── tauri.conf.json
└── public/                 # Static assets
```

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

If you find **Kanatype** useful and want to support its development, consider [sponsoring me on Ko-fi](https://ko-fi.com/matuz) (same as Wallpaper Picker UI).

Any amount is greatly appreciated!

---

## About

A simple and effective tool to help you learn Japanese characters.

Made with ❤️ by [Rodrigo Matuz](https://matuz.me)

---

**License**: MIT
