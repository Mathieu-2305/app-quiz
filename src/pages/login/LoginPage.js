import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MsLogo from '../../assets/images/ms-symbollockup_signin_light.svg';
import MsLogoDark from '../../assets/images/ms-symbollockup_signin_dark.svg';
import RafLogo from '../../assets/images/raflogo.png';
import bgLight from '../../assets/images/background-login.jpg';
import bgDark from '../../assets/images/background-login.jpg';
import styled from 'styled-components';
import { useTheme } from "../../context/theme";
import { useAuth } from "../../context/auth";
import { isInMsalPopup } from "../../utils/msalPopup";
import { useTranslation } from "react-i18next";
import ToggleThemeSwitch from "../../components/ui/ToggleThemeSwitch";
import LanguageSelector from "../../components/ui/LanguageSelector";

function LoginPage() {
    // Create a navigate() function that allows us to move between pages
	const navigate = useNavigate();

    // Gives the current URL
	const location = useLocation();

    // Retrieve the current theme and is used to know which one should be used, it is the same for the background image
	const { theme } = useTheme();

    // Retrieve the login() function and allow us to connect with Microsoft
	const { login } = useAuth();

    // Used to translate the page in the available languages
    const { t, i18n } = useTranslation();

    // Update the dir attribute to know in which direction the text should be read (R -> L / L -> R)
    useEffect(() => {
        document.documentElement.dir = i18n.dir();
    }, [i18n.resolvedLanguage, i18n]);

	// Redirect the user on /home if he's already in the localStorage except if he's in the MSAL popup
	useEffect(() => {
		if (isInMsalPopup()) return; // <--- Navigation in the Microsoft popup is forbidden
		const storedUser = localStorage.getItem('user');
		if (storedUser && location.pathname !== '/home') {
			navigate('/home', { replace: true });
		}
		}, [navigate, location]);


	// Redirect to /home unless a error occurs (the error is translated)
	const handleLogin = async () => {
		try {
			await login();
			navigate('/home', { replace: true });
		} catch (error) {
			console.error(`${t("login.error")}:`, error);
		}
	};

    // Use a different image depending on the current theme but there is only one image as those lines are written
    const bg = theme === 'dark' ? bgDark : bgLight;

	return (
        <>
            <Header>
                <LanguageSelector />
                <ToggleThemeSwitch />
            </Header>
                    
            <Container $bg={bg}>
                <Content>
                    <PageTitle>Rafisa Quiz</PageTitle>
                    <Box>
                        <Logo src={RafLogo} alt="Rafisa Logo" />
                        <Title>{t("login.title")}</Title>

                        <MicrosoftButton type="button" onClick={handleLogin} aria-label={t("login.microsoftSignIn")}>
                            <MicrosoftImg
                                src={theme === 'dark' ? MsLogoDark : MsLogo}
                                alt={t("login.microsoftAlt")}
                            />
                        </MicrosoftButton>
                    </Box>
                </Content>
            </Container>
        </>
	);
}

export default LoginPage;

const Header = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 1rem;
    z-index: 10;
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
	width: 100vw;
    height: 100vh;

    background-image: url(${p => p.$bg});
    background-size: cover;
    background-position: 65% 35%;
    background-repeat: no-repeat;

    background-color: var(--color-background);
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
`;

const PageTitle = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: black;
    text-align: center;
    margin: 0;
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