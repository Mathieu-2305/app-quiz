import styled from "styled-components";
import { createTimestamp } from "../utils/dateUtils";
import Tag from "./ui/Tag";
import { SquareArrowOutUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function QuizCard(props) {
  const { t } = useTranslation();
  const { id, title, modules, tags, imgURL, date, modified, isActive = true, onClick, onEdit, onDelete } = props;

  const safeClick = () => {
    if (!isActive) return; // désactive l’ouverture plein cadre si inactif
    onClick?.();
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const resolvedImg = imgURL?.startsWith("/") ? `${API_URL}${imgURL}` : imgURL;

  const safeModules = Array.isArray(modules)
    ? modules
        .map((m) => (typeof m === "string" ? m : m?.module_name ?? m?.name ?? ""))
        .filter(Boolean)
    : [];

  const safeTags = Array.isArray(tags)
    ? tags
        .map((t) => (typeof t === "string" ? t : t?.tag_name ?? t?.name ?? ""))
        .filter(Boolean)
    : [];

  return (
    <Container data-inactive={!isActive} onClick={safeClick}>
      <ImageWrapper>
        <Image style={{ backgroundImage: `url(${resolvedImg})` }} data-inactive={!isActive} />
        <Overlay>
          <SquareArrowOutUpRight size={32} color="var(--gray-50)" strokeWidth={2} />
          <OverlayTitle>{title}</OverlayTitle>
          <OverlayActions>
            <OverlayBtn
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(id);
              }}
              title={t("actions.edit")}
              aria-label={t("actions.edit")}
            >
              {t("actions.edit")}
            </OverlayBtn>
            <OverlayBtn
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(id);
              }}
              title={t("actions.delete")}
              aria-label={t("actions.delete")}
              data-variant="danger"
            >
              {t("actions.delete")}
            </OverlayBtn>
          </OverlayActions>
        </Overlay>
        {!isActive && <Ribbon>{t("common.inactive")}</Ribbon>}
      </ImageWrapper>

      <Section>
        <Title>{title}</Title>

        {safeModules.length > 0 && (
          <ModulesRow>
            {safeModules.slice(0, 3).map((mod, i) => (
              <Tag key={i} variant="primary">
                {mod}
              </Tag>
            ))}
            {safeModules.length > 3 && <Tag variant="primary">+{safeModules.length - 3}</Tag>}
          </ModulesRow>
        )}

        <TagsRow>
          {safeTags.map((tag, index) => (
            <Tag key={index} variant="secondary">
              {tag}
            </Tag>
          ))}
        </TagsRow>

        <Timestamp>{createTimestamp(date, modified)}</Timestamp>
      </Section>
    </Container>
  );
}

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: var(--spacing-5xl);
  min-height: 128px;
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: height 0.3s ease-in-out;
`;

const Section = styled.div`
  flex: 1;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-s) var(--spacing-s);
  transition: height 0.3s ease-in-out, opacity 0.2s ease, visibility 0.2s ease, padding 0.2s ease;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: var(--color-background-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: var(--spacing);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1;
`;

const OverlayTitle = styled.h3`
  margin-top: var(--spacing);
  color: var(--gray-50);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-l);
  font-weight: 600;
  text-align: center;
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: 0s;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-2xs);
  height: 100%;
  min-height: 280px;
  border-radius: var(--border-radius-l);
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    z-index: 1000;
  }
  &:hover ${ImageWrapper} {
    height: 100%;
  }
  &:hover ${Section} {
    opacity: 0;
    visibility: hidden;
    height: 0;
    padding: 0;
    flex: 0;
  }
  &:hover ${Overlay} {
    opacity: 1;
    visibility: visible;
  }
  &:hover ${OverlayTitle} {
    opacity: 1;
    transform: scale(1);
    transition-delay: 0.1s;
  }

  /* État inactif : on bloque le clic plein cadre et l’animation de scale,
     MAIS on laisse l’overlay s’afficher pour permettre Éditer/Supprimer. */
  &[data-inactive="true"] {
    cursor: not-allowed;
    opacity: 0.9;
  }
  &[data-inactive="true"]:hover {
    transform: none; /* pas d’agrandissement */
  }
  /* On garde la section visible par défaut pour l’inactif,
     mais si l’overlay s’affiche au survol, il sera au-dessus (z-index). */
`;

const Ribbon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #111827cc;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  z-index: 2;
`;

const Image = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;

  &[data-inactive="true"] {
    filter: grayscale(1) brightness(0.85);
  }
`;

const Title = styled.p`
  height: 40px;
  font-size: var(--font-size);
  line-height: var(--line-height-l);
  font-weight: 500;
  margin: var(--spacing-s) 0 var(--spacing-xs);
  color: var(--color-text);
`;

const TagsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-2xs);
  margin-bottom: var(--spacing);
`;

const Timestamp = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-placeholder);
  margin-top: auto;
  width: 100%;
`;

const ModulesRow = styled(TagsRow)`
  margin-bottom: 0;
`;

const OverlayActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: var(--spacing);
  flex-wrap: wrap;
  justify-content: center;
`;

const OverlayBtn = styled.button`
  border: 1px solid #ffffff55;
  background: #ffffff22;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #ffffff35;
  }

  &[data-variant="danger"] {
    border-color: #ef444455;
    background: #ef444422;
  }
`;
