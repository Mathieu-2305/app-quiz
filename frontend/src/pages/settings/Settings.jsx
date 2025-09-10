import ToggleThemeSwitch from "../../components/ui/ToggleThemeSwitch";
import styled from "styled-components";
import { Settings } from "lucide-react"
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/ui/LanguageSelector";
import Header from "../../components/layout/Header";

export default function SettingsPage() {
    // Translation function
    const { t } = useTranslation();
  return (
    <Main>
      <Header 
        title ={t("pages.settings.title")}
        icon ={<Settings size={20}/>}
        actions={[
          <LanguageSelector key="lang" />
        ]}
      />
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

const Content = styled.section` 
  flex: 1; 
  padding: 24px; 
`;