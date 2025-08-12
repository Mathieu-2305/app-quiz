import React from "react";
import * as msal from "@azure/msal-browser";

const AuthContext = React.createContext(null);
export const useAuth = () => React.useContext(AuthContext);

export function AuthProvider({ children }) {
    const pca = React.useMemo(() => new msal.PublicClientApplication({
        auth: {
      clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}`,
      redirectUri: process.env.REACT_APP_AZURE_REDIRECT_URI,
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

    // Si l'utilisateur change ->
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
    const tokenResponse = await pca.acquireTokenSilent({ scopes: ["User.Read"], account: user});

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
      // La fenêtre principale se redirigera ici après logout :
      mainWindowRedirectUri: "/login",
      // Le popup se redirige ici :
      postLogoutRedirectUri: process.env.REACT_APP_AZURE_REDIRECT_URI,
    });
  } catch (e) {
    // Fallback si le popup est bloqué → on passe en redirect plein écran
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