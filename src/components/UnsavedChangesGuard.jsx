import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useBlocker } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Affiche un modal quand when=true et l'utilisateur tente de quitter la page (refresh ou nouvelle url)

export default function UnsavedChangesGuard({ when = false }) {
  const blocker = useBlocker(when);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Ouvre le modal quand une navigation est bloquée
  useEffect(() => {
    if (blocker.state === "blocked") setOpen(true);
  }, [blocker.state]);

  // Prompt natif du navigateur (fermeture onglet / refresh)
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!when) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [when]);

  const stay = () => {
    setOpen(false);
    blocker.reset();
  };
  const leave = () => {
    setOpen(false);
    blocker.proceed();
  };

  if (!open) return null;

  return (
    <Overlay>
      <Box>
        <Title>{t("dialogs.unsaved.title")}</Title>
        <Text>{t("dialogs.unsaved.text")}</Text>
        <Row>
          <BtnSecondary onClick={stay}>{t("dialogs.unsaved.stay")}</BtnSecondary>
          <BtnPrimary onClick={leave}>{t("dialogs.unsaved.leave")}</BtnPrimary>
        </Row>
      </Box>
    </Overlay>
  );
}

// CSS
const Overlay = styled.div`
  position: fixed; 
  inset: 0; 
  display: flex; 
  justify-content: center; 
  align-items: center;
  background: rgba(0,0,0,0.5); 
  z-index: 9999;
`;
const Box = styled.div`
  background: white; 
  padding: 20px 24px; 
  border-radius: 10px;
  max-width: 360px; 
  width: 100%; 
  text-align: center; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  background-color: var(--color-background);
`;
const Title = styled.h2` 
  margin: 0 0 8px; 
  font-size: 18px; `;
const Text = styled.p` 
  margin: 0 0 16px; 
  color: #555; 
`;
const Row = styled.div` 
  display: flex; 
  justify-content: space-between; 
  gap: 8px;
`;
const BtnSecondary = styled.button`
  padding: 8px 12px; 
  background-color: var(--color-primary-bg); 
  border: none; 
  border-radius: 6px; 
  cursor: pointer;
`;
const BtnPrimary = styled.button`
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
