import React, {useState, useRef, useEffect, useCallback} from "react";
import styled from "styled-components";

const TagInput = ({
					  label,
					  suggestions = [], // array of { id, tag_name }
					  value = [],        // array of { id, tag_name }
					  onChange,
					  placeholder = "Ajouter un tag...",
					  prefixAdd = "Ajouter ",
					  allowNew = true,
					  width = "fit-content",
					  height="fit-content",
					  wrapperStyle,
					  labelStyle,
					  inputStyle,
					  wrapperClassName,
					  labelClassName,
					  inputClassName,
				  }) => {
	const [inputValue, setInputValue] = useState("");
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);

	// Update suggestions based on input
	const updateFilteredSuggestions = useCallback(
		(val) => {
			if (!suggestions) return;

			const filtered = suggestions.filter(
				(s) => s && s.tag_name && !value.find((t) => t?.id === s.id)
			);

			const matches = val
				? filtered.filter((s) =>
					s.tag_name.toLowerCase().includes(val.toLowerCase())
				)
				: filtered;

			setFilteredSuggestions(matches);
		},
		[value] // only value matters, suggestions can be stable (or memoized upstream)
	);

	// Filter suggestions on input change
	useEffect(() => {
		updateFilteredSuggestions(inputValue);
	}, [inputValue, updateFilteredSuggestions]);


	// Close dropdown if clicked outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const addTag = (tag) => {
		if (tag && !value.find((t) => t?.id === tag.id)) {
			onChange([...value, tag]);
			setInputValue("");
			setIsOpen(false);
		}
	};

	const removeTag = (tag) => {
		onChange(value.filter((t) => t?.id !== tag.id));
	};

	return (
		<Wrapper
			style={wrapperStyle}
			className={wrapperClassName}
			width={width}
			ref={containerRef}
		>
			{label && (
				<Label style={labelStyle} className={labelClassName}>
					{label}
				</Label>
			)}

			<TagContainer height={height}>
				{value.map((tag) => (
					tag && tag.tag_name && (
						<Tag key={tag.id}>
							{tag.tag_name}
							<RemoveButton onClick={() => removeTag(tag)}>×</RemoveButton>
						</Tag>
					)
				))}

				<StyledInput
					value={inputValue}
					onFocus={() => {
						if (inputValue.length > 0) setIsOpen(true);
					}}
					onChange={(e) => {
						const val = e.target.value;  // <-- define val
						setInputValue(val);
						setIsOpen(val.length > 0);   // now val is defined
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === "Tab") {
							e.preventDefault();
							if (inputValue.trim()) {
								const existing = suggestions.find(
									(s) =>
										s &&
										s.tag_name &&
										s.tag_name.toLowerCase() === inputValue.toLowerCase()
								);
								if (existing) {
									addTag(existing);
								} else if (allowNew) {
									// create a new tag if allowed
									addTag({ id: `new-${Date.now()}`, tag_name: inputValue.trim() });
								}
							}
						}
					}}
					placeholder={placeholder}
					style={inputStyle}
					className={inputClassName}
				/>
			</TagContainer>

			{isOpen && (
				<Dropdown>
					{filteredSuggestions.map(
						(s) =>
							s && (
								<DropdownItem key={s.id} onClick={() => addTag(s)}>
									{s.tag_name}
								</DropdownItem>
							)
					)}
					{allowNew &&
						inputValue &&
						!suggestions.find(
							(s) =>
								s &&
								s.tag_name &&
								s.tag_name.toLowerCase() === inputValue.toLowerCase()
						) && (
							<DropdownItem
								key={`new-${inputValue}`}
								onClick={() =>
									addTag({ id: `new-${Date.now()}`, tag_name: inputValue.trim() })
								}
							>
								{prefixAdd} "{inputValue}"
							</DropdownItem>
						)}
				</Dropdown>
			)}
		</Wrapper>
	);
};

export default TagInput;

/* ---------------- styled components ---------------- */

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: ${({ width }) => width};
`;

const Label = styled.label`
    font-size: var(--font-size);
    font-weight: 500;
    margin-bottom: var(--spacing-xs, 0.25rem);
    color: var(--color-text, #333);
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
	align-items: flex-start;
    gap: var(--spacing-xs, 0.25rem);
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--border-radius);
    padding: var(--spacing-xs, 0.25rem);
    background: var(--color-background-input, #fff);
    min-height: 50px;
    height: ${({ height }) => height};

    &:focus-within {
        border-color: var(--color-primary-bg, #2684ff);
    }
`;

const Tag = styled.div`
    display: flex;
    align-items: center;
    background: var(--color-primary-bg, #2684ff);
    color: var(--color-text, #333);
    border-radius: var(--border-radius);
    padding: var(--spacing-xs) var(--spacing-s);
    font-size: var(--font-size-s);
`;

const RemoveButton = styled.div`
    background: none;
    border: none;
    margin-left: var(--spacing-xs);
    color: var(--color-text, #333);
    font-size: var(--font-size);
    cursor: pointer;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--border-radius-full);
	
	&:hover {
		background: var(--color-primary-bg-hover, #2684ff);
	}
`;

const StyledInput = styled.input`
    border: none;
    outline: none;
    flex: 1;
    min-width: 120px;
    padding: 0.25rem;
    font-size: 0.875rem;
    background: transparent;
	height: 34px;
`;

const Dropdown = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 0.25rem 0 0;
    padding: 0;
    list-style: none;
    background: var(--color-background-input, #fff);
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--border-radius);
    max-height: 150px;
    overflow-y: auto;
    box-shadow: var(--box-shadow);
    transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.25s ease-in-out;
    z-index: 1000;
`;

const DropdownItem = styled.li`
	height: 40px;
	line-height: 40px;
    padding: 0 var(--spacing-s, 0.25rem);
    cursor: pointer;

    &:hover {
        background: var(--color-primary-bg, #f0f0f0);
    }
`;
