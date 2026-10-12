import { expect, test } from "bun:test";
import { Window } from "happy-dom";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { getDataByTypes } from "./data";
import { getPracticePool } from "./data/practice-pool";
import { LanguageProvider } from "./i18n/LanguageProvider";

const browserGlobals = [
	"window",
	"document",
	"navigator",
	"localStorage",
	"HTMLElement",
	"Node",
	"Event",
	"IS_REACT_ACT_ENVIRONMENT",
] as const;

function saveGlobals() {
	const scope = globalThis as unknown as Record<string, unknown>;
	return browserGlobals.map((key) => [key, scope[key]] as const);
}

function restoreGlobals(saved: ReturnType<typeof saveGlobals>) {
	const scope = globalThis as unknown as Record<string, unknown>;
	for (const [key, value] of saved) {
		if (value === undefined) delete scope[key];
		else scope[key] = value;
	}
}

test("changing language updates the mounted app and persists the choice", async () => {
	const globals = saveGlobals();
	const window = new Window({ url: "http://localhost/#/" });
	Object.assign(globalThis, {
		window,
		document: window.document,
		navigator: window.navigator,
		localStorage: window.localStorage,
		HTMLElement: window.HTMLElement,
		Node: window.Node,
		Event: window.Event,
		IS_REACT_ACT_ENVIRONMENT: true,
	});
	const { createRoot } = await import("react-dom/client");
	const host = globalThis.document.createElement("div");
	globalThis.document.body.append(host);
	const root = createRoot(host);
	try {
		await act(async () => {
			root.render(
				<LanguageProvider>
					<MemoryRouter>
						<App />
					</MemoryRouter>
				</LanguageProvider>,
			);
		});
		expect(host.textContent).toContain("Learn one character at a time.");
		const select = host.querySelector<HTMLSelectElement>("#app-language");
		if (!select) throw new Error("Missing language selector");
		await act(async () => {
			select.value = "pt-BR";
			select.dispatchEvent(new Event("change", { bubbles: true }));
		});
		expect(host.textContent).toContain("Aprenda um caractere de cada vez.");
		expect(window.localStorage.getItem("kanatype-language")).toBe("pt-BR");
		expect(window.document.documentElement.lang).toBe("pt-BR");
	} finally {
		await act(async () => root.unmount());
		window.happyDOM.cancelAsync();
		restoreGlobals(globals);
	}
});

test("switching language after a credited answer cancels the old advance without double credit", async () => {
	const globals = saveGlobals();
	const window = new Window({ url: "http://localhost/#/" });
	Object.assign(globalThis, {
		window,
		document: window.document,
		navigator: window.navigator,
		localStorage: window.localStorage,
		HTMLElement: window.HTMLElement,
		Node: window.Node,
		Event: window.Event,
		IS_REACT_ACT_ENVIRONMENT: true,
	});
	const { createRoot } = await import("react-dom/client");
	const host = globalThis.document.createElement("div");
	globalThis.document.body.append(host);
	const root = createRoot(host);
	try {
		await act(async () => {
			root.render(
				<LanguageProvider>
					<MemoryRouter>
						<App />
					</MemoryRouter>
				</LanguageProvider>,
			);
		});
		const firstGlyph = host.querySelector(".character-glyph")?.textContent;
		const item = getDataByTypes(["hiragana"]).find(
			(candidate) => candidate.type === "hiragana" && candidate.kana === firstGlyph,
		);
		if (!item || item.type !== "hiragana") throw new Error("Missing kana answer");
		const input = host.querySelector<HTMLInputElement>("#romaji-answer");
		if (!input) throw new Error("Missing answer input");
		await act(async () => {
			Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set?.call(
				input,
				item.romaji,
			);
			input.dispatchEvent(new Event("input", { bubbles: true }));
		});
		const form = host.querySelector(".answer-form");
		if (!form) throw new Error("Missing answer form");
		await act(async () => {
			form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
		});
		expect(host.textContent).toContain("1 answered");
		const select = host.querySelector<HTMLSelectElement>("#app-language");
		if (!select) throw new Error("Missing language selector");
		await act(async () => {
			select.value = "pt-BR";
			select.dispatchEvent(new Event("change", { bubbles: true }));
		});
		expect(host.textContent).toContain("1 respondidos");
		expect(host.querySelector(".character-glyph")?.textContent).not.toBe(firstGlyph);
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 650));
		});
		expect(host.textContent).toContain("1 respondidos");
	} finally {
		await act(async () => root.unmount());
		window.happyDOM.cancelAsync();
		restoreGlobals(globals);
	}
});

test("switching an untranslated N1 meaning question to Portuguese picks an eligible question", async () => {
	const globals = saveGlobals();
	const window = new Window({ url: "http://localhost/#/" });
	Object.assign(globalThis, {
		window,
		document: window.document,
		navigator: window.navigator,
		localStorage: window.localStorage,
		HTMLElement: window.HTMLElement,
		Node: window.Node,
		Event: window.Event,
		IS_REACT_ACT_ENVIRONMENT: true,
	});
	const selection = { mode: "meaning", level: 1, scope: "exact" } as const;
	window.localStorage.setItem("kanatype-practice-selection", JSON.stringify(selection));
	const englishPool = getPracticePool(["kanji"], selection, "en");
	const index = englishPool.findIndex((item) => item.type === "kanji" && item.kanji === "藤");
	if (index < 0) throw new Error("Missing untranslated N1 fixture");
	const random = Math.random;
	Math.random = () => (index + 0.5) / englishPool.length;
	const { createRoot } = await import("react-dom/client");
	const host = globalThis.document.createElement("div");
	globalThis.document.body.append(host);
	const root = createRoot(host);
	try {
		await act(async () => {
			root.render(
				<LanguageProvider>
					<MemoryRouter>
						<App />
					</MemoryRouter>
				</LanguageProvider>,
			);
		});
		const buttons = [...host.querySelectorAll<HTMLButtonElement>(".script-switcher button")];
		const kanji = buttons.find((button) => button.textContent === "Kanji");
		const hiragana = buttons.find((button) => button.textContent === "Hiragana");
		if (!kanji || !hiragana) throw new Error("Missing script toggles");
		await act(async () => {
			kanji.click();
		});
		await act(async () => {
			hiragana.click();
		});
		expect(host.querySelector(".character-glyph")?.textContent).toBe("藤");
		const select = host.querySelector<HTMLSelectElement>("#app-language");
		if (!select) throw new Error("Missing language selector");
		await act(async () => {
			select.value = "pt-BR";
			select.dispatchEvent(new Event("change", { bubbles: true }));
		});
		expect(host.querySelector(".character-glyph")?.textContent).not.toBe("藤");
		expect(host.textContent).toContain("950 perguntas de kanji");
		expect(host.textContent).toContain("SIGNIFICADO EM PORTUGUÊS");
	} finally {
		await act(async () => root.unmount());
		Math.random = random;
		window.happyDOM.cancelAsync();
		restoreGlobals(globals);
	}
});
