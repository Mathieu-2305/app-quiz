import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MsLogo from '../../assets/images/ms-symbollockup_signin_light.svg';
import MsLogoDark from '../../assets/images/ms-symbollockup_signin_dark.svg';
import RafLogo from '../../assets/images/raflogo.png';
import styled from 'styled-components';
import { useTheme } from "../../context/theme";
import { useAuth } from "../../context/auth";
import { isInMsalPopup } from "../../utils/msalPopup";
import LanguageSwitcher from "../../components/buttons/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { theme } = useTheme();
	const { login } = useAuth();
    const { t, i18n } = useTranslation();

    // Normalement ça fait en sorte que la langue reste la même quand on passe sur la HomePage
    useEffect(() => {
        document.documentElement.dir = i18n.dir();
    }, [i18n.resolvedLanguage, i18n]);

	// Si déjà connecté et pas sur /home, on redirige
	useEffect(() => {
		if (isInMsalPopup()) return; // <--- Pas de navigation dans le popup microsoft
		const storedUser = localStorage.getItem('user');
		if (storedUser && location.pathname !== '/home') {
			navigate('/home', { replace: true });
		}
		}, [navigate, location]);


	// Gestion du clic sur le bouton de connexion
	const handleLogin = async () => {
		try {
			await login();
			navigate('/home', { replace: true });
		} catch (error) {
			console.error(`${t("login.error")}:`, error);
		}
	};


	return (
		<Container>
			<Box>
                <LanguageSwitcher />
				{/* <ToggleThemeSwitch /> */}
				<Logo src={RafLogo} alt="Rafisa Logo" />
				<Title>{t("login.title")}</Title>

				<MicrosoftButton type="button" onClick={handleLogin} aria-label={t("login.microsoftSignIn")}>
					<MicrosoftImg
						src={theme === 'dark' ? MsLogoDark : MsLogo}
						alt={t("login.microsoftAlt")}
					/>
				</MicrosoftButton>
			</Box>
		</Container>
	);
}

export default LoginPage;


const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
	width: 100vw;
    height: 100vh;
    background-color: var(--color-background);
`;

const Box = styled.div`
    background-color: var(--color-background-elevated);
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
    color: var(--color-text);
    font-size: 1.25rem;
`;

const MicrosoftButton = styled.div`
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