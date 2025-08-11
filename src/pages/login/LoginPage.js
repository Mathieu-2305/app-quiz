import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MsLogo from '../../assets/ms-symbollockup_signin_light.svg';
import RafLogo from '../../assets/raflogo.png';
import * as msal from '@azure/msal-browser';
import styled from 'styled-components';


// Configuration de MSAL (Azure AD) MSAL = Bibliothèque d'authentification de Microsoft
const pca = new msal.PublicClientApplication({
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/' + process.env.REACT_APP_AZURE_TENANT_ID,
    redirectUri: process.env.REACT_APP_AZURE_REDIRECT_URI,
  },
});

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si déjà connecté et pas sur /home, on redirige
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && location.pathname !== '/home') {
      navigate('/home', { replace: true });
    }
  }, [navigate, location]);

  // Gestion du clic sur le bouton de connexion
  const handleLogin = async () => {
    try {
      await pca.initialize(); // initialise MSAL

      // Demande de connexion avec les droits User.Read (Permission de lire les infos basiques du profil, les paramètres du compte et les groupes/rôles de l'utilisateur)
      const loginRequest = { scopes: ['User.Read'] };
      const loginResponse = await pca.loginPopup(loginRequest);
      const user = loginResponse.account;

      // Récupération silencieuse du token
      const tokenResponse = await pca.acquireTokenSilent({
        scopes: ['User.Read'],
        account: user,
      });

      // Stockage du token et des infos du user
      localStorage.setItem('access_token', tokenResponse.accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirection vers l'accueil
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // Conteneur
    <Container>
      <Box>
        <Logo src={RafLogo} alt="Rafisa Logo" />
        <Title>Connexion </Title>

        {/* Bouton Microsoft */}
        <MicrosoftButton type="button" onClick={handleLogin} aria-label="Se connecter avec Microsoft">
          <MicrosoftImg src={MsLogo} alt="Microsoft Sign-in" />
        </MicrosoftButton>
      </Box>
    </Container>
  );
}

export default LoginPage;

/* CSS */
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
`;

const Box = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Logo = styled.img`
  width: 40px;
  height: auto;
  object-fit: contain;
  
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-weight: 600;
  color: #111827;
  font-size: 1.25rem;
`;

const MicrosoftButton = styled.button`
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.06s ease, box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const MicrosoftImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;