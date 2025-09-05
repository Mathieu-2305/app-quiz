import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {AuthContext, useAuth} from "../../context/auth";

export default function ProtectedRoute() {
	const { user, isInitialized } = useAuth();

	// Optionally show a loading spinner while checking auth
	if (!isInitialized) return <div>Loading...</div>;

	// Redirect if not logged in
	if (!user) return <Navigate to="/login" replace />;

	// Render protected content
	return <Outlet />;
}
