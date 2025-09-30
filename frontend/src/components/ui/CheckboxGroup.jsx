import React from "react";
import styled from "styled-components";
import { Check } from "lucide-react";

const CheckboxGroup = ({
						   label,
						   options = [],
						   value = [],
						   onChange,
						   direction = "column",
						   wrapperStyle,
						   labelStyle,
						   optionStyle,
						   wrapperClassName,
						   labelClassName,
						   optionClassName,
					   }) => {
	const handleToggle = (id) => {
		if (value.includes(id)) {
			onChange(value.filter((v) => v !== id));
		} else {
			onChange([...value, id]);
		}
	};

	return (
		<Wrapper style={wrapperStyle} className={wrapperClassName}>
			{label && (
				<Label style={labelStyle} className={labelClassName}>
					{label}
				</Label>
			)}

			<Options direction={direction}>
				{options.map((opt) => {
					const isChecked = value.includes(opt.id);
					return (
						<OptionBox
							key={opt.id}
							checked={isChecked}
							style={optionStyle}
							className={optionClassName}
							onClick={() => handleToggle(opt.id)}
						>
							<CheckIconWrapper checked={isChecked}>
								 <Check size={16} color={isChecked ? "var(--color-btn-text)" : "var(--color-placeholder)"}/>
							</CheckIconWrapper>
							<OptionLabel checked={isChecked}>{opt.label}</OptionLabel>
						</OptionBox>
					);
				})}
			</Options>
		</Wrapper>
	);
};

export default CheckboxGroup;


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    font-size: var(--font-size);
    font-weight: 500;
    margin-bottom: var(--spacing-xs, 0.25rem);
    color: var(--color-text, #333);
`;

const Options = styled.div`
    display: flex;
    flex-direction: ${({ direction }) => (direction === "row" ? "row" : "column")};
    gap: var(--spacing-s, 0.75rem);
    flex-wrap: wrap;
`;

const OptionBox = styled.div`
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.5rem);
    padding: var(--spacing-xs, 0.5rem) var(--spacing-s, 0.75rem);
    border: 1px solid ${({ checked }) => (checked ? "var(--color-primary-bg, #2684ff)" : "var(--color-border)")};
    border-radius: var(--border-radius, 4px);
    background-color: ${({ checked }) => (checked ? "var(--color-primary-bg, #2684ff)" : "var(--color-background-input)")};
    color: ${({ checked }) => (checked ? "#fff" : "var(--color-text, #333)")};
    cursor: pointer;
    transition: all 0.2s;
	height: 34px;

    &:hover {
        border-color: var(--color-primary-bg, #2684ff);
        background-color: var(--color-primary-bg-hover, #2684ff);
    }
`;

const CheckIconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ checked }) => (checked ? "#fff" : "#ccc")};
`;

const OptionLabel = styled.span`
    font-size: var(--font-size-s, 0.875rem);
	color: ${({ checked }) => (checked ? "var(--color-text, #333)" : "var(--color-placeholder, #333)")};
`;
