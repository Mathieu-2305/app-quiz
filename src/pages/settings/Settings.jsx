import ToggleThemeSwitch from "../../components/ui/ToggleThemeSwitch";
import styled from "styled-components";
import { Settings } from "lucide-react"
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
    const { t } = useTranslation();
  return (
    <Main>
      <Header>
        <Title><Settings />{t("pages.settings.title")}</Title>
      </Header>
      <Content>
        <ToggleThemeSwitch />
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
const Content = styled.section` 
  flex: 1; 
  padding: 24px; 
`;