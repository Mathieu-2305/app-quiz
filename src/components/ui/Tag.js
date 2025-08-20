import styled from "styled-components";

export default function Tag({ children, icon, style, onClick }) {
	return (
		<StyledTag style={style} onClick={onClick}>
			{icon && <IconWrapper>{icon}</IconWrapper>}
			{children}
		</StyledTag>
	);
}

const StyledTag = styled.span`
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2xs);

    padding: var(--spacing-2xs) var(--spacing-s);
    font-size: var(--font-size-s);
    font-weight: 500;

    background-color: var(--color-background-input);
    color: var(--color-placeholder);

    border-radius: var(--border-radius-full);
    cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
    user-select: none;

    &:hover {
        opacity: ${({ onClick }) => (onClick ? 0.9 : 1)};
    }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: inherit;
`;
