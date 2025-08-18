import React, { useState } from 'react';
import { FilePenLine, Save } from "lucide-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/buttons/LanguageSwitcher";
import UnsavedChangesGuard from "../../components/UnsavedChangesGuard";
import ToggleSwitch from "../../components/buttons/ToggleSwitchButton";

export default function NewQuiz() {
    const { t } = useTranslation();
    const [isDirty, setIsDirty] = useState(false);
    const [active, setActive] = useState(true);

    const onSave = () => {
    // logique de sauvegarde à mettre ici 
    console.log("tkt c'est save");
    setIsDirty(false);
};
    return (
	// Header
    <Main>
      <UnsavedChangesGuard when={isDirty} />
      <Header>
        <Title>
          <FilePenLine size={24} /> {t("pages.newQuiz.title")}
        </Title>
        <Controls>
          <ToggleSwitch
            checked={active}
            onChange={setActive}
            onLabel={t("buttons.toggleswitchon")}
            offLabel={t("buttons.toggleswitchoff")}
            onColor="#22c55e" offColor="#e5e7eb"
          />
          <LanguageSwitcher />
          <SaveButton onClick={onSave}>
            <Save size={16} /> {t("buttons.saveQuiz")}
          </SaveButton>
        </Controls>
      </Header>
      <input onChange={() => setIsDirty(true)} placeholder={t("pages.newQuiz.titleplaceholder")} />
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
  gap: 16px;
  padding: 0 24px;
  background-color: var(--color-background);
`;
const Controls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;
const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const SaveButton = styled.button`
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