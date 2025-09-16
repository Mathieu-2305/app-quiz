import styled from "styled-components";
import { createTimestamp } from "../utils/dateUtils";
import Tag from "./ui/Tag";
import { SquareArrowOutUpRight } from "lucide-react";

export default function QuizCard(props) {
	const { title, tags, imgURL, date, modified, isActive = true, onClick } = props;

    const safeClick = () => {
    if (!isActive) return;
    onClick?.();
  };

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const resolvedImg = imgURL?.startsWith("/")
        ? `${API_URL}${imgURL}`
        : imgURL;

	return (
        <Container data-inactive={!isActive} onClick={safeClick}>
        <ImageWrapper>
            <Image
            style={{ backgroundImage: `url(${resolvedImg})` }}
            data-inactive={!isActive}
            />
            <Overlay>
            <SquareArrowOutUpRight size={32} color="var(--gray-50)" strokeWidth={2} />
            <OverlayTitle>{title}</OverlayTitle>
            </Overlay>
            {!isActive && <Ribbon>Inactif</Ribbon>}
        </ImageWrapper>

        <Section>
            <Title>{title}</Title>
            <TagsRow>
            {tags.map((tag, index) => (
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
  transition: height 0.3s ease-in-out, opacity .2s ease, visibility .2s ease, padding .2s ease;
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
  transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    z-index: 1000;
  }
  &:hover ${ImageWrapper} { height: 100%; }
  &:hover ${Section} {
    opacity: 0;
    visibility: hidden;
    height: 0;
    padding: 0;
    flex: 0;
  }
  &:hover ${Overlay} { opacity: 1; visibility: visible; }
  &:hover ${OverlayTitle} {
    opacity: 1; transform: scale(1);
    transition-delay: 0.1s;
  }

  &[data-inactive="true"] {
    cursor: not-allowed;
    opacity: 0.9;
  }
  &[data-inactive="true"]:hover {
    transform: none;
  }
  &[data-inactive="true"]:hover ${ImageWrapper} {
    height: var(--spacing-5xl);
  }
  &[data-inactive="true"]:hover ${Section} {
    opacity: 1;
    visibility: visible;
    height: auto;
    padding: 0 var(--spacing-s) var(--spacing-s);
    flex: 1;
  }
  &[data-inactive="true"]:hover ${Overlay} {
    opacity: 0;
    visibility: hidden;
  }
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
    filter: grayscale(1) brightness(.85);
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