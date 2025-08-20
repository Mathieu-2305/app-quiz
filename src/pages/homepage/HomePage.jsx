import React from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Plus } from "lucide-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Header from "../../components/layout/Header";
import Button from "../../components/ui/Button";

export default function HomePage() {
    // Gives the navigate() function to change pages with the React Router
	const navigate = useNavigate();

    // Translation function
	const { t } = useTranslation();

  return (
    <Main>
      <Header
        title={t("pages.home.title")}
        icon={<FlaskConical size={20} aria-hidden="true" />}
        actions={[
          <LanguageSelector key="lang" />,
          <NewQuizButton
            key="new"
            onClick={() => navigate("/quiz/new")}
            aria-label={t("actions.newQuiz")}
            title={t("actions.newQuiz")}
          >
            <Plus size={16} aria-hidden="true" /> {t("actions.newQuiz")}
          </NewQuizButton>,
        ]}
      />
      <Content>
        <Placeholder />
      </Content>
    </Main>
  );
}

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--color-background);
`;

const NewQuizButton = styled(Button)`
  background-color: #2563eb;
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
