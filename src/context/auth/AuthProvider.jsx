// src/context/auth/AuthProvider.jsx
import React from "react";
import * as msal from "@azure/msal-browser";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
	const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin;

	const pca = React.useMemo(() => new msal.PublicClientApplication({
		auth: {
			clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
			authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
			redirectUri: redirectUri,
		},
		cache: { cacheLocation: "localStorage" }
	}), []);

	const [account, setAccount] = React.useState(null);

	// Init + restore session
	React.useEffect(() => {
		let mounted = true;
		(async () => {
			await pca.initialize();
			const accs = pca.getAllAccounts();
			if (mounted && accs.length) setAccount(accs[0]);
		})();

		const cbId = pca.addEventCallback((e) => {
			if (e.eventType === msal.EventType.LOGIN_SUCCESS && e.payload?.account) {
				setAccount(e.payload.account);
			}
			if (e.eventType === msal.EventType.ACCOUNT_REMOVED) {
				const accs = pca.getAllAccounts();
				setAccount(accs[0] || null);
			}
		});

		return () => {
			mounted = false;
			if (cbId) pca.removeEventCallback(cbId);
		};
	}, [pca]);

	const login = async () => {
		const loginResponse = await pca.loginPopup({ scopes: ["User.Read"] });
		const user = loginResponse.account;
		const tokenResponse = await pca.acquireTokenSilent({ scopes: ["User.Read"], account: user });

		localStorage.setItem("access_token", tokenResponse.accessToken);
		localStorage.setItem("user", JSON.stringify(user));
		setAccount(user);
		return { user, accessToken: tokenResponse.accessToken };
	};

	const getToken = async (scopes = ["User.Read"]) => {
		if (!account) return null;
		const res = await pca.acquireTokenSilent({ scopes, account });
		return res.accessToken;
	};

	const logout = async () => {
		try {
			await pca.logoutPopup({
				mainWindowRedirectUri: "/login",
				postLogoutRedirectUri: process.env.REACT_APP_AZURE_REDIRECT_URI,
			});
		} catch (e) {
			await pca.logoutRedirect({
				postLogoutRedirectUri: process.env.REACT_APP_AZURE_REDIRECT_URI,
			});
		} finally {
			localStorage.removeItem("access_token");
			localStorage.removeItem("user");
			setAccount(null);
			pca.setActiveAccount(undefined);
		}
	};

	const value = {
		account,
		isAuthenticated: !!account,
		login,
		logout,
		getToken,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
