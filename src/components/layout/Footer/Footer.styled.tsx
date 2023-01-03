import styled from 'styled-components';
import { Container } from 'styled/elements/Container';

export const FooterContent = styled(Container)`
	margin-top: 40px;
`;

export const FooterGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	grid-template-rows: repeat(16, 1fr);

	@media screen and (min-width: 769px) {
		grid-template-rows: repeat(15, 1fr);
	}
`;

export const LogoWrapper = styled.div`
	grid-column: 1 / -1;
	grid-row: 1 / span 2;

	@media screen and (min-width: 1281px) {
		grid-column: 1 / 7;
		grid-row: 1 / 13;
	}
`;
export const ListWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-column: 1 / -1;
	grid-row: 3 / -3;

	@media screen and (min-width: 769px) {
		grid-template-columns: repeat(4, 1fr);
		grid-row: 4 / -3;
	}

	@media screen and (min-width: 1281px) {
		grid-column: 7 / -1;
		grid-row: 1 / 13;
	}
`;
export const FooterSection = styled.div`
	padding: 0 10px 35px 0;
`;
export const FooterCategory = styled.p`
	text-transform: capitalize;
	font-size: 16px;
	line-height: 26px;
	padding: 5px 0 18px 0;
	font-weight: 600;
`;
export const FooterList = styled.ul``;
export const FooterItem = styled.li`
	line-height: 35px;
`;
export const FooterLink = styled.a`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme: { colors } }) => colors.colorNeutral6};
`;

export const FooterCopyright = styled.p`
	grid-column: 1 / -1;
	grid-row: -2;
	color: ${({ theme: { colors } }) => colors.colorNeutral6};
	font-weight: 500;
`;
