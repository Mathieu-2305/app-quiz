import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import { routes } from "./routes.jsx";
import { isInMsalPopup } from "./utils/msalPopup";
import "./App.css";

function App() {
	if (isInMsalPopup()) return null;

	return (
		<BrowserRouter>
			<Routes>
				{/* Public routes */}
				{routes
					.filter((r) => !r.protected)
					.map(({ path, element }) => (
						<Route key={path} path={path} element={element} />
					))}

				{/* Protected routes */}
				<Route element={<ProtectedRoute />}>
					{routes
						.filter((r) => r.protected)
						.map(({ path, element, layout }) => {
							// wrap in layout if provided
							const Component = layout ? () => layout({ children: element }) : () => element;
							return <Route key={path} path={path} element={<Component />} />;
						})}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
