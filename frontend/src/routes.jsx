// routes.jsx
import HomePage from "./pages/homepage/HomePage.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import NewQuiz from "./pages/quiz_editor/NewQuiz.jsx";
import SettingsPage from "./pages/settings/Settings.jsx";
import AppLayout from "./components/layout/AppLayout";

export const routes = [
	{
		path: "/login",
		element: <LoginPage />,
		protected: false,
	},
	{
		path: "/home",
		element: <HomePage />,
		protected: true,
		layout: AppLayout
	},
	{
		path: "/quiz/new",
		element: <NewQuiz />,
		protected: true,
	},
	{
		path: "/settings",
		element: <SettingsPage />,
		protected: true,
		layout: AppLayout
	},
	{
		path: "*",
		element: <HomePage />, // fallback to home
		protected: true,
		layout: AppLayout
	},
];
