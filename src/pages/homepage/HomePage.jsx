import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Settings, Search, LogOut, FlaskConical, Plus } from "lucide-react";
import styled from "styled-components";
import MyLogo from "../../assets/images/raflogo.png";
import Sidebar from "../../components/Sidebar";

export default function HomePage() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("user");
		if (!stored) {
			navigate("/login", { replace: true });
			return;
		}
		try {
			setUser(JSON.parse(stored));
		} catch {
			navigate("/login", { replace: true });
		}
	}, [navigate]);

	// Suppression user et access token du local storage puis retour au login
	const handleLogoutClick = () => {
		setShowLogoutModal(true);
	};

	// Confirmation Logout
	const confirmLogout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("user");
		navigate("/login", { replace: true });
	};

	// Boutons de la sidebar + redirections
	const itemsTop = [
		{ key: "quiz", title: "Quiz", icon: <FlaskConical size={24} />, to: "/home" },
		{ key: "results", title: "Résultats", icon: <Award size={24} />, to: "/results" },
		{ key: "search", title: "Recherche", icon: <Search size={24} />, to: "/search" },
	];

	const itemsBottom = [
		{ key: "settings", title: "Paramètres", icon: <Settings size={24} />, to: "/settings" },
		{ key: "logout", title: "Logout", icon: <LogOut size={24} color="#ef4444" />, onClick: handleLogoutClick },
	];

	return (
		<>
			{/* Sidebar et header */}
			<Container>
				<Sidebar
					logoSrc={MyLogo}
					logoAlt="Rafisa"
					itemsTop={itemsTop}
					itemsBottom={itemsBottom}
					avatarText={(user && (user.username || user.name || user.localAccountId)) ? (user.username?.slice(0,2) || "AB") : "AB"}
				/>

				<Main>
					<Header>
						<Title>
							<FlaskConical size={24} /> Quiz
						</Title>
						<NewQuizButton onClick={() => navigate("/quiz/new")}>
							<Plus size={16} /> Nouveau Quiz
						</NewQuizButton>
					</Header>
					<Content>
						<Placeholder />
					</Content>
				</Main>
			</Container>

			{/* Modal de confirmation */}
			{showLogoutModal && (
				<ModalOverlay>
					<ModalBox>
						<ModalTitle>Déconnexion</ModalTitle>
						<ModalText>Voulez-vous vraiment vous déconnecter ?</ModalText>
						<ModalButton>
							<CancelButton onClick={() => setShowLogoutModal(false)}>Annuler</CancelButton>
							<ConfirmButton onClick={confirmLogout}>Oui</ConfirmButton>
						</ModalButton>
					</ModalBox>
				</ModalOverlay>
			)}
		</>
	);
}

/* CSS */
const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    background: #fff;
    color: #333;
    font-family: Arial, sans-serif;
`;

const Main = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
	width: 100%;
`;

const Header = styled.header`
    height: 64px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
`;

const Title = styled.h1`
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const NewQuizButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: #2563eb;
    color: white;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background-color: #1e40af;
    }
`;

const Content = styled.section`
    flex: 1;
    padding: 24px;
`;

const Placeholder = styled.div`
    height: 100%;
    width: 100%;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    background-color: white;
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalBox = styled.div`
    background: white;
    padding: 20px 24px;
    border-radius: 8px;
    max-width: 320px;
    width: 100%;
    text-align: center;
`;

const ModalTitle = styled.h2`
    margin: 0 0 8px;
    font-size: 18px;
`;

const ModalText = styled.p`
    margin: 0 0 16px;
    color: #555;
`;

const ModalButton = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 8px;
`;

const CancelButton = styled.button`
    padding: 8px;
    background: #e5e7eb;
`;

const ConfirmButton = styled.button`
    background: #ef4444;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
        background: #dc2626;
    }
`;