import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ArrowLeft, BookOpen, Layers3, Maximize2, Minus, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Language } from "@/i18n/translation";
import type { ScriptType } from "@/types";

const scriptOptions: ScriptType[] = ["hiragana", "katakana", "kanji"];

type HeaderProps =
	| {
			mode: "practice";
			activeScripts: ScriptType[];
			onToggle: (script: ScriptType) => void;
			onSelectAll: () => void;
			onNavigate: () => void;
	  }
	| { mode: "table"; onNavigate: () => void };

export default function Header(props: HeaderProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const { language, setLanguage, t } = useLanguage();
	const isDark = resolvedTheme === "dark";
	const nativeWindow = isTauri() ? getCurrentWindow() : null;

	return (
		<header className="app-header">
			<div
				className={nativeWindow ? "header-leading draggable" : "header-leading"}
				data-tauri-drag-region
			>
				<span className="brand-mark" aria-hidden="true" data-tauri-drag-region>
					カ
				</span>
				<div className="brand-copy" data-tauri-drag-region>
					<strong data-tauri-drag-region>{t("app.brand.name")}</strong>
					<span data-tauri-drag-region>{t("app.brand.tagline")}</span>
				</div>
			</div>

			{props.mode === "practice" ? (
				<fieldset className="script-switcher">
					<legend className="sr-only">{t("app.scripts.legend")}</legend>
					{scriptOptions.map((key) => (
						<Button
							key={key}
							type="button"
							variant={props.activeScripts.includes(key) ? "default" : "outline"}
							aria-pressed={props.activeScripts.includes(key)}
							onClick={() => props.onToggle(key)}
							size="sm"
						>
							{t(`app.scripts.${key}`)}
						</Button>
					))}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={props.onSelectAll}
						aria-label={t("app.scripts.allLabel")}
					>
						<Layers3 aria-hidden="true" size={16} /> {t("app.scripts.all")}
					</Button>
				</fieldset>
			) : (
				<span className="header-section-label">{t("app.header.reference")}</span>
			)}

			<nav className="header-actions" aria-label={t("app.navigation.label")}>
				<label htmlFor="app-language" className="sr-only">
					{t("app.language.label")}
				</label>
				<select
					id="app-language"
					aria-label={t("app.language.label")}
					value={language}
					onChange={(event) => setLanguage(event.target.value as Language)}
				>
					<option value="en">{t("app.language.en")}</option>
					<option value="pt-BR">{t("app.language.pt-BR")}</option>
				</select>
				<Button type="button" variant="outline" size="sm" onClick={props.onNavigate}>
					{props.mode === "table" ? (
						<ArrowLeft aria-hidden="true" size={16} />
					) : (
						<BookOpen aria-hidden="true" size={16} />
					)}
					{props.mode === "table"
						? t("app.navigation.practice")
						: t("app.navigation.reference")}
				</Button>
				<Button
					type="button"
					variant="outline"
					size="icon-sm"
					onClick={() => setTheme(isDark ? "light" : "dark")}
					aria-label={t(isDark ? "app.theme.light" : "app.theme.dark")}
				>
					{isDark ? (
						<Sun aria-hidden="true" size={18} />
					) : (
						<Moon aria-hidden="true" size={18} />
					)}
				</Button>
				{nativeWindow && (
					<fieldset className="window-controls">
						<legend className="sr-only">{t("app.window.legend")}</legend>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label={t("app.window.minimize")}
							onClick={() => void nativeWindow.minimize()}
						>
							<Minus aria-hidden="true" size={16} />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label={t("app.window.maximize")}
							onClick={() => void nativeWindow.toggleMaximize()}
						>
							<Maximize2 aria-hidden="true" size={16} />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label={t("app.window.close")}
							onClick={() => void nativeWindow.close()}
						>
							<X aria-hidden="true" size={16} />
						</Button>
					</fieldset>
				)}
			</nav>
		</header>
	);
}
