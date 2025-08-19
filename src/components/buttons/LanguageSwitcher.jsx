import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const change = (e) => i18n.changeLanguage(e.target.value);
  return (
    <Wrap>
      <Select value={i18n.resolvedLanguage} onChange={change} aria-label="Language">
        <option value="fr">🇫🇷 Français</option>
        <option value="en">🇺🇸 English</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="it">🇮🇹 Italiano</option>
      </Select>
    </Wrap>
  );
}

const Wrap = styled.div` 
  padding: 0 8px; 
`;
const Select = styled.select` 
  font-size: 16px; 
  padding: 4px 6px; 
  border-radius: 6px; 
`;
