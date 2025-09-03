import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";


export default function Sidebar({ logoSrc, logoAlt = "Logo", itemsTop = [], itemsBottom = [], avatarText }) {
	// Get the current URL to know which button is active
	const location = useLocation();

	// Displays a sidebar's element
	const renderItem = (item) => {
		// Tells if the element is displayed as active
		const isActive = (() => {
			if (item.activePattern instanceof RegExp) return item.activePattern.test(location.pathname);
			if (item.to) return location.pathname === item.to;
			return false;
		})();

		// Buttons with dynamic styles according to $active
		const Btn = (
			<IconButton title={item.title} $active={isActive} onClick={item.onClick} aria-label={item.title}>
				{item.icon}
			</IconButton>
		);

		// If the element has a "to" route, we surround it with a <Link>
		return item.to ? (
			<StyledLink to={item.to} key={item.key}>
				{Btn}
			</StyledLink>
		) : (
			<span key={item.key}>{Btn}</span>
		);
	};

	return (
		<Aside>
			{/* Sidebar's upper part with the logo and itemsTop */}
			<Stack>
				{logoSrc ? (
					<LogoCircle title={logoAlt} aria-label={logoAlt}>
						<img src={logoSrc} alt={logoAlt} />
					</LogoCircle>
				) : (
					<LogoCircle title="Logo" aria-label="Logo">🦋</LogoCircle>
				)}

				{itemsTop.map(renderItem)}
			</Stack>

            

			{/* Down part of the sidebar with itemsBottom and the avatar */}
			<Stack>
				{itemsBottom.map(renderItem)}
				{avatarText ? <Avatar title="User">{avatarText}</Avatar> : null}
			</Stack>
		</Aside>
	);
}

const Aside = styled.aside`
    width: 64px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 12px 0;
    align-items: center;
    background-color: var(--color-background);
`;
const Stack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
`;
const StyledLink = styled(Link)`
    text-decoration: none;
`;
const LogoCircle = styled.div`
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    font-size: 18px;
    color: #0284c7;
    font-weight: bold;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;
const IconButton = styled.button`
    border: none;
    background: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-500);

    /* hover */
    &:hover {
        background-color: var(--gray-300);
    }

    /* active state */
    ${(p) =>
            p.$active &&
            `
    background-color: var(--gray-300);
    border-radius: 8px;
  `}
`;
const Avatar = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    color: #6b7280;
    margin-bottom: 4px;
`;