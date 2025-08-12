import './App.css';
import LoginPage from './pages/login/LoginPage';
import HomePage from './pages/homepage/HomePage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isInMsalPopup } from './utils/msalPopup';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  if (isInMsalPopup()) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/new"
          element={
            <ProtectedRoute>
              <div>Créer un quiz…</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
