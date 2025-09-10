import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ThemeProvider} from "./context/theme";
import {AuthProvider} from "./context/auth";
import './components/ui/styles/index.css'
import './i18n';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</AuthProvider>
	</StrictMode>,
)
