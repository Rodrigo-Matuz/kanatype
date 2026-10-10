import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Missing app root element");

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<ThemeProvider>
			<HashRouter>
				<App />
			</HashRouter>
		</ThemeProvider>
	</React.StrictMode>,
);
