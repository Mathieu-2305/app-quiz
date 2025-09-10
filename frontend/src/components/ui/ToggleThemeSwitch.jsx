import React from 'react';
import styled from 'styled-components';
import {FiMoon, FiSun } from "react-icons/fi";
import {useTheme} from "../../context/theme/index.js";

const ToggleThemeSwitch = () => {

    const { theme, toggleTheme } = useTheme();

    return (
        <SwitchContainer>
            <HiddenCheckbox id={'theme-switch'} checked={theme === 'dark'} onChange={() => toggleTheme()} />
            <StyledLabel htmlFor={'theme-switch'}>
                <IconWrapper>
                    <FiSun  />
                </IconWrapper>
                <IconWrapper>
                    <FiMoon  />
                </IconWrapper>
                <ToggleButton $ison={(theme === 'dark').toString()}>
                    {theme === 'dark' ? <FiMoon /> : <FiSun />}
                </ToggleButton>
            </StyledLabel>
        </SwitchContainer>
    );
};

export default ToggleThemeSwitch;


const SwitchContainer = styled.div`
	display: flex;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
	height: 0;
	width: 0;
	visibility: hidden;
`;

const StyledLabel = styled.label`
	cursor: pointer;
	width: var(--spacing-3xl);
	height: var(--spacing-xl);
	background: var(--color-background-surface);
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 50px;
	padding: 0 8px;
	position: relative;
	transition: background 0.3s;
	box-sizing: border-box;
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const IconWrapper = styled.span`
	display: flex;
	align-items: center;

	justify-content: center;
	color: var(--color-placeholder);
	font-size: var(--font-size-s);
	z-index: 0;
`;

const ToggleButton = styled.span`
	position: absolute;
	top: 3px;
	left: 3px;
	width: calc(var(--spacing-xl) - 6px);
	height: calc(var(--spacing-xl) - 6px);
	background: var(--color-primary-bg);
	border-radius: 50%;
	transition: 0.3s;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-primary-text);
	font-size: var(--font-size-s);

	${({ $ison }) =>
            $ison === "true" &&
    `
    left: calc(100% - 3px);
    transform: translateX(-100%);
  `}
`;