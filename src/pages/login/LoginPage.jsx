import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MsLogo from '../../assets/images/ms-symbollockup_signin_light.svg';
import MsLogoDark from '../../assets/images/ms-symbollockup_signin_dark.svg';
import RafLogo from '../../assets/images/raflogo.png';
import bgLight from '../../assets/images/background-login.jpg';
import bgDark from '../../assets/images/background-login.jpg';
import loginBackground from '../../assets/images/login_background.png';
import styled from 'styled-components';
import {LogIn} from "lucide-react";
import { useTheme } from "../../context/theme";
import { useAuth } from "../../context/auth";
import { isInMsalPopup } from "../../utils/msalPopup";
import { useTranslation } from "react-i18next";
import ToggleThemeSwitch from "../../components/ui/ToggleThemeSwitch";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Button from "../../components/ui/Button";

function LoginPage() {

	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	const { isAuthenticated, login } = useAuth();
    const { theme } = useTheme();

    // Update the dir attribute to know in which direction the text should be read (R -> L / L -> R)
    useEffect(() => {
        document.documentElement.dir = i18n.dir();
    }, [i18n.resolvedLanguage, i18n]);

	// Redirect the user on /home if he's already in the localStorage except if he's in the MSAL popup
	useEffect(() => {
		if (isInMsalPopup()) return;
		// If user is authenticated, *and* they came to /login manually (not from logout)
		if (isAuthenticated && location.pathname === "/login" && !location.state?.fromLogout) {
			//navigate("/home", { replace: true });
		}
	}, [isAuthenticated, navigate, location]);

	// Redirect to /home unless a error occurs (the error is translated)
	const handleLogin = async () => {
		try {
			await login();
			navigate('/home', { replace: true });
		} catch (error) {
			console.error(`${t("pages.login.error")}:`, error);
		}
	};

    // Use a different image depending on the current theme but there is only one image as those lines are written
    const bg = theme === 'dark' ? bgDark : bgLight;

	return (
        <>
            <Container $bg={loginBackground}>
                <Content>
					<RightContent>
						<RightContentTop>
							<LanguageSelector />
							<ToggleThemeSwitch />
						</RightContentTop>

						<RightContentContent>
							<Title>{import.meta.env.VITE_APP_TITLE}</Title>
							<Subtitle>{t("login.description")}</Subtitle>
							<Button variant={"tertiary"} onClick={handleLogin} style={{marginLeft: "auto"}}>
								<LogIn size={24} />
								{t("login.sign_in")}
							</Button>
						</RightContentContent>
					</RightContent>

					<LeftContent $background={loginBackground}>
						<Logo src={RafLogo} alt="Rafisa Logo" />
					</LeftContent>
                </Content>
            </Container>
        </>
	);
}

export default LoginPage;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
	width: 100vw;
    height: 100vh;
    background: var(--gradient-primary);
    //background: url(${props => props.$bg}) no-repeat center;
`;

const Content = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    padding: var(--spacing-s);
    border-radius: var(--border-radius-xl);
    width: var(--spacing-12xl);
	max-height: 90vh;
	gap: var(--spacing-s);
    background: var(--liquidglass-bg);
    backdrop-filter: var(--liquidglass-blur);
    -webkit-backdrop-filter: var(--liquidglass-blur);
    box-shadow: var(--liquidglass-shadow);
    min-height: 600px;
`;

const LeftContent = styled.div`
    flex: 1;
    width: 50%;
    background-size: cover;
    background: url(${props => props.$background}) no-repeat center;
    border-radius: var(--border-radius-l);
    padding: var(--spacing);
    position: relative;
`;

const Logo = styled.img`
    width: 40px;
    height: auto;
    object-fit: contain;
`;

const RightContent = styled.div`
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: relative;
`;

const RightContentContent = styled.div`
	width: 100%;
    padding: var(--spacing-3xl);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: relative;
	flex: 1;
`;

const Title = styled.h1`
    width: 100%;
    font-size: var(--font-size-5xl);
    font-weight: 600;
    color: var(--color-text);
	margin: 0 0 var(--spacing-l);
`;

const Subtitle = styled.h2`
    width: 100%;
    font-weight: 600;
    color: var(--color-text);
    font-size: var(--font-size);
	line-height: var(--line-height-l);
    margin-bottom: var(--spacing-l);
`;

const RightContentTop = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
	justify-content: flex-end;
	bottom: 0;
	right: 0;
	gap: var(--spacing-xs);
	padding: var(--spacing-xs);
`;