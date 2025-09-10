import React from 'react';
import styled from 'styled-components';

const Divider = ({
	                 vertical = false,
	                 spacing = 'var(--spacing)',
	                 color = 'var(--color-border)',
	                 thickness = '1px',
	                 style, className }
) => {
	return (
		<StyledDivider
			$vertical={vertical.toString()}
			spacing={spacing}
			color={color}
			$thickness={thickness}
			style={style}
			className={className}
		/>
	);
};

export default Divider;


const StyledDivider = styled.hr`
	background-color: ${({ color }) => color};
	margin: ${({ $vertical, spacing }) =>
	$vertical === "true" ? `0 ${spacing}` : `${spacing} 0`};
	width: ${({ $vertical, $thickness }) => ($vertical === "true" ? $thickness : '100%')};
	height: ${({ $vertical, $thickness }) => ($vertical === "true" ? '100%' : $thickness)};
	flex-shrink: 0;
	border: 0;
`;
