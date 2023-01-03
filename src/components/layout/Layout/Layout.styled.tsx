import styled from 'styled-components';

export const Main = styled.main``;

export const HeaderWrapper = styled.header`
	display: flex;
	flex-direction: column;
	background: ${({ theme: { colors } }) => colors.bgColor};

	@media screen and (min-width: 1200px) {
		flex-direction: column-reverse;
	}
`;
