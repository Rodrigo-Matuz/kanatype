import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Global theme provider for the application
 *
 * Responsibilities:
 * - Enables dark/light theme support
 * - Syncs theme state across the app
 * - Allows Tailwind "dark:" classes to work
 *
 * This wraps the entire application near the root level.
 */
export function ThemeProvider({
	children,
}: {
	/**
	 * Any React components rendered inside the provider
	 */
	children: React.ReactNode;
}) {
	return (
		<NextThemesProvider
			/**
			 * Uses the HTML "class" attribute to control themes.
			 *
			 * Example:
			 * <html class="dark">
			 *
			 * This is required for Tailwind dark mode classes.
			 */
			attribute="class"
			/**
			 * Default theme when the app first loads
			 *
			 * "system" means:
			 * - follow user's operating system preference
			 * - dark mode if OS is dark
			 * - light mode if OS is light
			 */
			defaultTheme="system"
			/**
			 * Allows automatic syncing with system theme changes
			 */
			enableSystem
		>
			{children}
		</NextThemesProvider>
	);
}