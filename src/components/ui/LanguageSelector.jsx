import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import Flag from 'react-world-flags';
import { FiChevronDown } from 'react-icons/fi';

const languages = [
    { code: 'en', label: 'English', countryCode: 'US' },
    { code: 'fr', label: 'Français', countryCode: 'FR' },
    { code: 'de', label: 'Deutsch', countryCode: 'DE' },
    // add more languages here
];

const LanguageDropdown = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const toggleDropdown = () => setIsOpen(prev => !prev);

    const selectLanguage = (code) => {
        if (code !== currentLang.code) {
            i18n.changeLanguage(code);
            setIsOpen(false);
        }
    };

    return (
        <DropdownContainer ref={ref}>
            <DropdownHeader onClick={toggleDropdown}>
                <Flag code={currentLang.countryCode} style={{ width: 20, height: 15 }} />
                {currentLang.label}
                <ChevronIcon $isopen={isOpen.toString()} />
            </DropdownHeader>

            <DropdownList $isopen={isOpen.toString()}>
                {languages.map(({ code, label, countryCode }) => (
                    <DropdownItem
                        key={code}
                        disabled={code === currentLang.code}
                        onClick={() => selectLanguage(code)}
                    >
                        <Flag code={countryCode} style={{ width: 20, height: 15 }} />
                        {label}
                    </DropdownItem>
                ))}
            </DropdownList>
        </DropdownContainer>
    );
};

export default LanguageDropdown;

const DropdownContainer = styled.div`
    position: relative;
    width: var(--spacing-6xl);
    user-select: none;
`;

const DropdownHeader = styled.div`
    border-radius: var(--border-radius);
    background-color: var(--color-background-surface);
    padding: var(--spacing-xs) var(--spacing);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size);
    user-select: none;
`;

const ChevronIcon = styled(FiChevronDown)`
    margin-left: auto;
    transition: transform 0.3s ease;
    ${({ $isopen }) => $isopen === "true" && css`
        transform: rotate(-180deg);
    `}
`;

const DropdownList = styled.ul`
    width: var(--spacing-6xl);
    border-radius: var(--border-radius);
    background-color: var(--color-background-surface);
    position: absolute;
    top: calc(100% + var(--spacing-2xs));
    transform: ${({ $isopen }) => ($isopen === "true" ? 'scale(1)' : 'scale(0.85)')};
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--color-border);
    max-height: ${({ $isopen }) => ($isopen === "true" ? '200px' : '0')};
    opacity: ${({ $isopen }) => ($isopen === "true" ? 1 : 0)};
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.25s ease-in-out;
    z-index: 1000;
`;

const DropdownItem = styled.li`
    padding: var(--spacing-xs) var(--spacing);
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    color: ${({ disabled }) => (disabled ? 'var(--color-placeholder)' : 'var(--color-text)')};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
    background-color: ${({ disabled }) => (disabled ? 'var(--primary-color-bg)' : 'transparent')};
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size);

    &:hover {
        background-color: ${({ disabled }) => (disabled ? 'inherit' : 'var(--color-primary-bg-hover)')};
    }
`;
