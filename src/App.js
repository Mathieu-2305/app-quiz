import './App.css';
import AppLayout from "./components/layout/AppLayout";
import LoginPage from './pages/login/LoginPage';
import HomePage from './pages/homepage/HomePage';
import SettingsPage from './pages/settings/Settings';
import NewQuiz from './pages/quiz_editor/NewQuiz';
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { isInMsalPopup } from './utils/msalPopup';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </ProtectedRoute>
    ),
    children: [
      { path: "home", element: <HomePage /> },
      { path: "quiz/new", element: <NewQuiz /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <Navigate to="/home" replace /> }
    ],
  },
]);

export default function App() {
  if (isInMsalPopup()) return null;
  return <RouterProvider router={router} />;
}
