import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ThemeProvider} from "./context/theme";
import {AuthProvider} from "./context/auth";
import './components/ui/styles/index.css'
import './i18n';
import App from './App.jsx'
import {SkeletonTheme} from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<ThemeProvider>
				<SkeletonTheme baseColor={"var(--color-skeleton-base)"} highlightColor={"var(--color-skeleton-highlight)"}>
					<App />
				</SkeletonTheme>
			</ThemeProvider>
		</AuthProvider>
	</StrictMode>,
)
