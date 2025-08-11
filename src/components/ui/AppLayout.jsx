import styled from "styled-components";
import NavBar from "./NavBar.jsx";

const ButtonWrapper = styled.div`
	margin-top: 1.5rem;
	
	button {
		padding: 10px 16px;
		font-size: 1rem;
		cursor: pointer;
	}
`;

export { ButtonWrapper };

export const AppLayout = ({
	                          children,
	                          maxWidth = '1920px',
	                          padding = 'var(--spacing-l)',
	                          containerStyle = {},
	                          contentStyle = {},
	                          appBarComponent = NavBar,
	                          showAppBar = true,
	                          navLeft = null,
	                          navCenter = null,
	                          navRight = null
                          }) => {
	const AppBarComponent = appBarComponent;

	return (
		<Container style={containerStyle}>
			{showAppBar && (
				<NavBar left={navLeft} center={navCenter} right={navRight} />
			)}
			<Content $maxWidth={maxWidth} $padding={padding} style={contentStyle}>
				{children}
			</Content>
		</Container>
	);
};


const Container = styled.div`
	width: 100vw;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
`;

const Content = styled.div`
	padding: ${({ $padding }) => $padding};
	max-width: ${({ $maxWidth }) => $maxWidth};
	box-sizing: border-box;
	margin: auto;
	flex-grow: 1;
	width: 100%;
`;
