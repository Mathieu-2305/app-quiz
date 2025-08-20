import styled from "styled-components";
import { createTimestamp } from "../utils/dateUtils";
import Tag from "../components/ui/Tag";
import { SquareArrowOutUpRight } from "lucide-react";

export default function QuizCard2(item) {
	const { title, tags, imgURL, date, modified } = item;

	return (
		<Container>
			<ImageWrapper>
				<Image style={{ backgroundImage: `url(${imgURL})` }} />
				<Overlay>
					<SquareArrowOutUpRight size={32} color="var(--gray-50)" strokeWidth={2}/>
				</Overlay>
			</ImageWrapper>
			<Section>
				<Title>{title}</Title>
				<Tags>
					{tags.map((tag, index) => (
						<Tag key={index}>{tag}</Tag>
					))}
				</Tags>
				<Timestamp>{createTimestamp(date, modified)}</Timestamp>
			</Section>
		</Container>
	);
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: var(--spacing-2xs);
    height: 100%;
    border-radius: var(--border-radius-l);
    border: 1px solid var(--color-border);
	transition: all .2s ease;
    cursor: pointer;

    &:hover {
        background-color: var(--color-primary-muted);
		transform: scale(1.05);
		z-index: 1000;
    }
	
    &:hover > div > div:last-child {
        opacity: 1;
        visibility: visible;
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: var(--spacing-5xl);
    border-radius: var(--border-radius);
    overflow: hidden;
`;

const Image = styled.div`
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    background: var(--color-background-overlay);

    display: flex;
    align-items: center;
    justify-content: center;

    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
	z-index: 1;
`;

const Section = styled.div`
    flex: 1;
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: 0 var(--spacing-s) var(--spacing-s);
`;

const Title = styled.p`
    height: 40px;
    font-size: var(--font-size);
    line-height: var(--line-height-l);
    font-weight: 600;
    margin: var(--spacing-s) 0 var(--spacing-xs);
	color: var(--color-text);
`;

const Tags = styled.div`
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
