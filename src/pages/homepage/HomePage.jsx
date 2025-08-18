import React from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Plus } from "lucide-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/buttons/LanguageSwitcher";

export default function HomePage() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
	// Header
    <Main>
      <Header>
        <Title>
          <FlaskConical size={24} /> {t("pages.home.title")}
        </Title>
        <Controls>
          <LanguageSwitcher />
          <NewQuizButton onClick={() => navigate("/quiz/new")}>
            <Plus size={16} /> {t("buttons.newQuiz")}
          </NewQuizButton>
        </Controls>
      </Header>
      <Content>
        <Placeholder />
      </Content>
    </Main>
  );
}

// CSS 
const Main = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
	  width: 100%;
	  background-color: var(--color-background);
`;
const Header = styled.header`
    height: 64px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
	  background-color: var(--color-background);
`;
const Title = styled.h1`
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;
const Controls = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 12px;
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
    background-color: var(--color-background-elevated);
`;